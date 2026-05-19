<script setup lang="ts">
import Matter from 'matter-js';
import {
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  type CSSProperties,
} from 'vue';

import { useTranslations } from '@/composables/useTranslations';

const props = withDefaults(
  defineProps<{
    containerSelector?: string;
  }>(),
  {
    containerSelector: '[data-football-container="true"]',
  },
);

const { t } = useTranslations();

const buttonRef = ref<HTMLButtonElement | null>(null);
const isInPlay = ref(false);
const isDragging = ref(false);
const isIdleJumping = ref(false);
const footballStyle = ref<CSSProperties>({});

const FOOTBALL_IMAGE_URL = '/soccerball.svg';
const FOOTBALL_SIZE = 38;
const FOOTBALL_RADIUS = FOOTBALL_SIZE / 2;
const FOOTBALL_HITBOX_SIZE = 54;
const FOOTBALL_HITBOX_RADIUS = FOOTBALL_HITBOX_SIZE / 2;
const FOOTBALL_WALL_SIZE = 80;
const DRAG_THRESHOLD = 4;
const THROW_VELOCITY_MULTIPLIER = 16.7;
const MAX_THROW_VELOCITY = 20;
const IDLE_JUMP_DURATION = 520;
const MIN_IDLE_JUMP_DELAY = 1_800;
const MAX_IDLE_JUMP_DELAY = 5_400;

type DragState = {
  hasMoved: boolean;
  lastTime: number;
  lastX: number;
  lastY: number;
  pointerId: number;
  startedWorld: boolean;
  startX: number;
  startY: number;
  velocityX: number;
  velocityY: number;
};

let engine: Matter.Engine | null = null;
let runner: Matter.Runner | null = null;
let ball: Matter.Body | null = null;
let walls: Matter.Body[] = [];
let resizeObserver: ResizeObserver | null = null;
let dragState: DragState | null = null;
let idleJumpTimeout: number | undefined;
let idleJumpResetTimeout: number | undefined;

const footballLabel = computed(() =>
  isInPlay.value ? t('v1.ball.game.kick') : t('v1.ball.game.start'),
);

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const getIdleJumpDelay = () =>
  MIN_IDLE_JUMP_DELAY +
  Math.random() * (MAX_IDLE_JUMP_DELAY - MIN_IDLE_JUMP_DELAY);

const clearIdleJump = () => {
  window.clearTimeout(idleJumpTimeout);
  window.clearTimeout(idleJumpResetTimeout);
  idleJumpTimeout = undefined;
  idleJumpResetTimeout = undefined;
  isIdleJumping.value = false;
};

const scheduleIdleJump = () => {
  if (isInPlay.value) {
    return;
  }

  idleJumpTimeout = window.setTimeout(() => {
    idleJumpTimeout = undefined;

    if (isInPlay.value) {
      return;
    }

    isIdleJumping.value = true;
    idleJumpResetTimeout = window.setTimeout(() => {
      idleJumpResetTimeout = undefined;
      isIdleJumping.value = false;
      scheduleIdleJump();
    }, IDLE_JUMP_DURATION);
  }, getIdleJumpDelay());
};

const getContainer = () =>
  buttonRef.value?.closest<HTMLElement>(props.containerSelector) ?? null;

const getPointInContainer = (event: PointerEvent) => {
  const container = getContainer();

  if (!container) {
    return null;
  }

  const containerRect = container.getBoundingClientRect();

  return {
    x: clamp(
      event.clientX - containerRect.left,
      FOOTBALL_RADIUS,
      container.clientWidth - FOOTBALL_RADIUS,
    ),
    y: clamp(
      event.clientY - containerRect.top,
      FOOTBALL_RADIUS,
      container.clientHeight - FOOTBALL_RADIUS,
    ),
  };
};

const createWalls = (width: number, height: number) => [
  Matter.Bodies.rectangle(
    width / 2,
    height + FOOTBALL_WALL_SIZE / 2,
    width + FOOTBALL_WALL_SIZE * 2,
    FOOTBALL_WALL_SIZE,
    { isStatic: true },
  ),
  Matter.Bodies.rectangle(
    width / 2,
    -FOOTBALL_WALL_SIZE / 2,
    width + FOOTBALL_WALL_SIZE * 2,
    FOOTBALL_WALL_SIZE,
    { isStatic: true },
  ),
  Matter.Bodies.rectangle(
    -FOOTBALL_WALL_SIZE / 2,
    height / 2,
    FOOTBALL_WALL_SIZE,
    height + FOOTBALL_WALL_SIZE * 2,
    { isStatic: true },
  ),
  Matter.Bodies.rectangle(
    width + FOOTBALL_WALL_SIZE / 2,
    height / 2,
    FOOTBALL_WALL_SIZE,
    height + FOOTBALL_WALL_SIZE * 2,
    { isStatic: true },
  ),
];

const syncStyle = () => {
  if (!ball) {
    return;
  }

  footballStyle.value = {
    transform: `translate3d(${ball.position.x - FOOTBALL_HITBOX_RADIUS}px, ${
      ball.position.y - FOOTBALL_HITBOX_RADIUS
    }px, 0) rotate(${ball.angle}rad)`,
  };
};

const getStartPosition = () => {
  const container = getContainer();
  const button = buttonRef.value;

  if (!container || !button) {
    return null;
  }

  const containerRect = container.getBoundingClientRect();
  const buttonRect = button.getBoundingClientRect();

  return {
    x: buttonRect.left - containerRect.left + buttonRect.width / 2,
    y: buttonRect.top - containerRect.top + buttonRect.height / 2,
  };
};

const resizeWorld = () => {
  const container = getContainer();

  if (!container || !engine || !ball) {
    return;
  }

  Matter.Composite.remove(engine.world, walls);
  walls = createWalls(container.clientWidth, container.clientHeight);
  Matter.Composite.add(engine.world, walls);
  Matter.Body.setPosition(ball, {
    x: clamp(
      ball.position.x,
      FOOTBALL_RADIUS,
      container.clientWidth - FOOTBALL_RADIUS,
    ),
    y: clamp(
      ball.position.y,
      FOOTBALL_RADIUS,
      container.clientHeight - FOOTBALL_RADIUS,
    ),
  });
  syncStyle();
};

const stopWorld = () => {
  clearIdleJump();

  if (runner) {
    Matter.Runner.stop(runner);
  }

  if (engine) {
    Matter.Events.off(engine, 'afterUpdate', syncStyle);
    Matter.Composite.clear(engine.world, false);
    Matter.Engine.clear(engine);
  }

  engine = null;
  runner = null;
  ball = null;
  walls = [];
  dragState = null;
  isInPlay.value = false;
  isDragging.value = false;
  footballStyle.value = {};
};

const startWorld = () => {
  const container = getContainer();
  const position = getStartPosition();

  if (!container || !position) {
    return false;
  }

  stopWorld();

  engine = Matter.Engine.create();
  engine.gravity.y = 1.15;
  runner = Matter.Runner.create();
  ball = Matter.Bodies.circle(position.x, position.y, FOOTBALL_RADIUS, {
    density: 0.002,
    friction: 0.02,
    frictionAir: 0.008,
    restitution: 0.86,
  });
  walls = createWalls(container.clientWidth, container.clientHeight);

  Matter.Composite.add(engine.world, [ball, ...walls]);
  Matter.Events.on(engine, 'afterUpdate', syncStyle);
  syncStyle();

  isInPlay.value = true;
  Matter.Body.setVelocity(ball, { x: 0.8, y: 0 });
  Matter.Body.setAngularVelocity(ball, 0.12);
  Matter.Runner.run(runner, engine);

  return true;
};

const kick = () => {
  if (!ball) {
    return;
  }

  const direction = Math.random() > 0.5 ? 1 : -1;

  Matter.Body.setVelocity(ball, {
    x: direction * (5 + Math.random() * 5),
    y: -(13 + Math.random() * 5),
  });
  Matter.Body.setAngularVelocity(
    ball,
    direction * (0.36 + Math.random() * 0.28),
  );
};

const beginDrag = (point: { x: number; y: number }) => {
  if (!ball) {
    return;
  }

  isDragging.value = true;
  Matter.Body.setStatic(ball, true);
  Matter.Body.setVelocity(ball, { x: 0, y: 0 });
  Matter.Body.setAngularVelocity(ball, 0);
  Matter.Body.setPosition(ball, point);
  syncStyle();
};

const dragTo = (event: PointerEvent) => {
  if (!dragState || !ball || event.pointerId !== dragState.pointerId) {
    return;
  }

  const point = getPointInContainer(event);

  if (!point) {
    return;
  }

  const now = performance.now();
  const deltaTime = Math.max(now - dragState.lastTime, 1);
  const movedDistance = Math.hypot(
    point.x - dragState.startX,
    point.y - dragState.startY,
  );

  dragState.velocityX = (point.x - dragState.lastX) / deltaTime;
  dragState.velocityY = (point.y - dragState.lastY) / deltaTime;
  dragState.lastX = point.x;
  dragState.lastY = point.y;
  dragState.lastTime = now;

  if (!dragState.hasMoved && movedDistance < DRAG_THRESHOLD) {
    return;
  }

  if (!dragState.hasMoved) {
    dragState.hasMoved = true;
    beginDrag(point);

    return;
  }

  Matter.Body.setPosition(ball, point);
  Matter.Body.setAngle(ball, ball.angle + dragState.velocityX * 0.14);
  syncStyle();
};

const endDrag = (event: PointerEvent) => {
  if (!dragState || event.pointerId !== dragState.pointerId) {
    return;
  }

  if (buttonRef.value?.hasPointerCapture(event.pointerId)) {
    buttonRef.value.releasePointerCapture(event.pointerId);
  }

  if (!ball) {
    dragState = null;

    return;
  }

  if (dragState.hasMoved) {
    Matter.Body.setStatic(ball, false);
    Matter.Body.setVelocity(ball, {
      x: clamp(
        dragState.velocityX * THROW_VELOCITY_MULTIPLIER,
        -MAX_THROW_VELOCITY,
        MAX_THROW_VELOCITY,
      ),
      y: clamp(
        dragState.velocityY * THROW_VELOCITY_MULTIPLIER,
        -MAX_THROW_VELOCITY,
        MAX_THROW_VELOCITY,
      ),
    });
    Matter.Body.setAngularVelocity(
      ball,
      clamp(dragState.velocityX * 0.35, -0.45, 0.45),
    );
  } else if (!dragState.startedWorld) {
    kick();
  }

  dragState = null;
  isDragging.value = false;
};

const handlePointerDown = (event: PointerEvent) => {
  if (event.button !== 0 || dragState) {
    return;
  }

  const startedWorld = !isInPlay.value;

  if (startedWorld && !startWorld()) {
    return;
  }

  const point = getPointInContainer(event);

  if (!point) {
    return;
  }

  buttonRef.value?.setPointerCapture(event.pointerId);
  dragState = {
    hasMoved: false,
    lastTime: performance.now(),
    lastX: point.x,
    lastY: point.y,
    pointerId: event.pointerId,
    startedWorld,
    startX: point.x,
    startY: point.y,
    velocityX: 0,
    velocityY: 0,
  };
};

const handlePointerCancel = (event: PointerEvent) => {
  if (!dragState || event.pointerId !== dragState.pointerId) {
    return;
  }

  if (ball && isDragging.value) {
    Matter.Body.setStatic(ball, false);
  }

  dragState = null;
  isDragging.value = false;
};

const handleKeyboardAction = () => {
  if (!isInPlay.value) {
    startWorld();

    return;
  }

  kick();
};

onMounted(() => {
  scheduleIdleJump();

  void nextTick(() => {
    const container = getContainer();

    if (!container) {
      return;
    }

    resizeObserver = new ResizeObserver(resizeWorld);
    resizeObserver.observe(container);
  });
});

onUnmounted(() => {
  clearIdleJump();
  resizeObserver?.disconnect();
  stopWorld();
});
</script>

<template>
  <button
    ref="buttonRef"
    class="f-bouncing-football"
    :class="{
      'f-bouncing-football--dragging': isDragging,
      'f-bouncing-football--idle-jump': isIdleJumping,
      'f-bouncing-football--in-play': isInPlay,
    }"
    :style="isInPlay ? footballStyle : undefined"
    type="button"
    :aria-label="footballLabel"
    @keydown.enter.prevent="handleKeyboardAction"
    @keydown.space.prevent="handleKeyboardAction"
    @pointercancel="handlePointerCancel"
    @pointerdown="handlePointerDown"
    @pointermove="dragTo"
    @pointerup="endDrag"
  >
    <img
      class="f-bouncing-football__image"
      :src="FOOTBALL_IMAGE_URL"
      alt=""
      draggable="false"
    />
  </button>
</template>

<style scoped lang="scss">
.f-bouncing-football {
  display: inline-flex;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  margin-left: 8px;
  appearance: none;
  background: transparent;
  cursor: grab;
  touch-action: none;
}

.f-bouncing-football--idle-jump {
  animation: f-bouncing-football-idle-jump 0.52s ease-out;
}

.f-bouncing-football--in-play {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 54px;
  height: 54px;
  margin-left: 0;
  will-change: transform;
}

.f-bouncing-football--dragging {
  z-index: 3;
  cursor: grabbing;
}

.f-bouncing-football__image {
  display: block;
  width: 38px;
  height: 38px;
  pointer-events: none;
  user-select: none;
}

@keyframes f-bouncing-football-idle-jump {
  0%,
  100% {
    transform: translateY(0);
  }

  45% {
    transform: translateY(-9px);
  }
}
</style>
