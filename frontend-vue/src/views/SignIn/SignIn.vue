<script setup lang="ts">
import {
  Button,
  Card,
  Divider,
  Image,
  InputText,
  Message,
  Password,
} from 'primevue';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { z } from 'zod';

import signInHeroUrl from '@/assets/sign-in-hero.png';
import FAuthPageEmpty from '@/components/FAuthPageEmpty.vue';
import FText from '@/components/FText.vue';
import { usePageTitle } from '@/composables/usePageTitle';
import { useTranslations } from '@/composables/useTranslations';
import { RoutePath } from '@/enums';
import { useAuthStore } from '@/stores/authStore';

const { t } = useTranslations();
const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const requestError = ref('');

const errors = ref<Partial<Record<'email' | 'password', string>>>({});
const signInSchema = computed(() =>
  z.object({
    email: z.string().email(t('v1.invalid.email')),
    password: z.string().min(6, t('v1.invalid.password')),
  }),
);

const handleSubmit = async () => {
  const result = signInSchema.value.safeParse({
    email: email.value,
    password: password.value,
  });

  if (!result.success) {
    errors.value = Object.fromEntries(
      result.error.issues.map((issue) => [issue.path[0], issue.message]),
    );

    return;
  }

  errors.value = {};
  requestError.value = '';

  try {
    await authStore.signIn(result.data);
    await router.push(RoutePath.Root);
  } catch {
    requestError.value =
      authStore.requestStatus === 400
        ? t('v1.invalid.credentials')
        : t('v1.general.error');
  }
};

usePageTitle(computed(() => t('v1.log.in')));
</script>

<template>
  <FAuthPageEmpty>
    <div class="sign-in">
      <Image
        class="sign-in__hero-image"
        :src="signInHeroUrl"
        :alt="t('v1.sign.in.hero.alt')"
      />

      <Card class="sign-in__card">
        <template #title>
          <div class="sign-in__title">
            <FText as="h2" variant="heading-2">
              {{ t('v1.log.in') }}
            </FText>
            <FText as="p" color="--p-text-muted-color" variant="body-2">
              {{ t('v1.sign.in.subtitle') }}
            </FText>
          </div>
        </template>

        <template #content>
          <form class="sign-in__form" @submit.prevent="handleSubmit">
            <Message v-if="requestError" severity="error" size="small">
              {{ requestError }}
            </Message>

            <label class="sign-in__field">
              <FText as="span" variant="body-2-bold">
                {{ t('v1.email') }}
              </FText>
              <InputText
                id="sign-in-email"
                v-model="email"
                autocomplete="email"
                name="email"
                placeholder="you@example.com"
                type="email"
                :invalid="Boolean(errors.email)"
              />
              <small v-if="errors.email" class="sign-in__error-message">
                {{ errors.email }}
              </small>
            </label>

            <label class="sign-in__field">
              <FText as="span" variant="body-2-bold">
                {{ t('v1.password') }}
              </FText>
              <Password
                v-model="password"
                input-id="sign-in-password"
                autocomplete="current-password"
                name="password"
                placeholder="***********"
                :feedback="false"
                :invalid="Boolean(errors.password)"
                toggle-mask
                fluid
              />
              <small v-if="errors.password" class="sign-in__error-message">
                {{ errors.password }}
              </small>
            </label>

            <Button
              type="submit"
              :label="t('v1.log.in')"
              :loading="authStore.isSubmitting"
            />
          </form>

          <Divider />

          <RouterLink v-slot="{ navigate }" :to="RoutePath.Register" custom>
            <Button
              type="button"
              :label="t('v1.register')"
              severity="secondary"
              outlined
              fluid
              @click="navigate"
            />
          </RouterLink>
        </template>
      </Card>
    </div>
  </FAuthPageEmpty>
</template>

<style scoped lang="scss">
.sign-in {
  display: grid;
  width: min(100%, 1080px);
  grid-template-columns: minmax(0, 1.05fr) minmax(360px, 0.95fr);
  align-items: center;
  gap: 24px;

  &__hero-image {
    display: block;
    width: 100%;

    :deep(img) {
      width: 100%;
      max-height: 680px;
      object-fit: contain;
    }
  }

  &__card {
    width: 100%;
  }

  &__title {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__form {
    display: grid;
    gap: 24px;
  }

  &__field {
    display: grid;
    gap: 8px;

    :deep(.p-inputtext),
    :deep(.p-password) {
      width: 100%;
    }
  }

  &__error-message {
    color: var(--p-red-500);
  }
}

@media (width <= 860px) {
  .sign-in {
    grid-template-columns: 1fr;
  }
}

@media (width <= 560px) {
  .sign-in__hero-image {
    display: none;
  }
}
</style>
