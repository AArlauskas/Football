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
import FFormField from '@/components/FFormField.vue';
import FText from '@/components/FText.vue';
import { usePageTitle } from '@/composables/usePageTitle';
import { useTranslations } from '@/composables/useTranslations';
import { RoutePath } from '@/enums';
import { isRegistrationOpen } from '@/lib/registration';
import { useAuthStore } from '@/stores/authStore';

const { t } = useTranslations();
const authStore = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const requestError = ref('');

const errors = ref<Partial<Record<'email' | 'password', string>>>({});
const canRegister = computed(() => isRegistrationOpen());
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

            <FFormField
              class="sign-in__field"
              :error="errors.email"
              input-id="sign-in-email"
              :label="t('v1.email')"
            >
              <InputText
                id="sign-in-email"
                v-model="email"
                autocomplete="email"
                name="email"
                placeholder="you@example.com"
                type="email"
                :invalid="Boolean(errors.email)"
              />
            </FFormField>

            <FFormField
              class="sign-in__field"
              :error="errors.password"
              input-id="sign-in-password"
              :label="t('v1.password')"
            >
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
            </FFormField>

            <Button
              type="submit"
              :label="t('v1.log.in')"
              :loading="authStore.isSubmitting"
            />
          </form>

          <template v-if="canRegister">
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
  gap: var(--f-space-xl);

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
    gap: var(--f-space-md);
  }

  &__form {
    display: grid;
    gap: var(--f-space-xl);
  }

  &__field {
    :deep(.p-inputtext),
    :deep(.p-password) {
      width: 100%;
    }
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
