<script setup lang="ts">
import { Button, Card, Checkbox, InputText, Message, Password } from 'primevue';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { z } from 'zod';

import FAuthPageEmpty from '@/components/FAuthPageEmpty.vue';
import FText from '@/components/FText.vue';
import { usePageTitle } from '@/composables/usePageTitle';
import { useTranslations } from '@/composables/useTranslations';
import { RoutePath } from '@/enums';
import { useAuthStore } from '@/stores/authStore';

const { t } = useTranslations();
const authStore = useAuthStore();
const router = useRouter();

const confirmPassword = ref('');
const email = ref('');
const firstName = ref('');
const lastName = ref('');
const password = ref('');
const requestError = ref('');
const termsAccepted = ref(false);

const errors = ref<
  Partial<
    Record<
      | 'confirmPassword'
      | 'email'
      | 'firstName'
      | 'lastName'
      | 'password'
      | 'termsAccepted',
      string
    >
  >
>({});
const registerSchema = computed(() =>
  z
    .object({
      confirmPassword: z.string(),
      email: z.string().email(t('v1.invalid.email')),
      firstName: z.string().trim().min(1, t('v1.invalid.first.name')),
      lastName: z.string().trim().min(1, t('v1.invalid.last.name')),
      password: z.string().min(6, t('v1.invalid.password')),
      termsAccepted: z.literal(true, {
        error: t('v1.register.terms.required'),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('v1.passwords.must.match'),
      path: ['confirmPassword'],
    }),
);

const handleSubmit = async () => {
  const result = registerSchema.value.safeParse({
    confirmPassword: confirmPassword.value,
    email: email.value,
    firstName: firstName.value,
    lastName: lastName.value,
    password: password.value,
    termsAccepted: termsAccepted.value,
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
    await authStore.signUp({
      email: result.data.email,
      firstName: result.data.firstName,
      lastName: result.data.lastName,
      password: result.data.password,
    });
    await router.push(RoutePath.SignIn);
  } catch {
    requestError.value = t('v1.general.error');
  }
};

usePageTitle(computed(() => t('v1.register')));
</script>

<template>
  <FAuthPageEmpty>
    <div class="register">
      <Card class="register__card">
        <template #title>
          <RouterLink
            v-slot="{ navigate }"
            :to="RoutePath.SignIn"
            custom
            class="register__back-button"
          >
            <Button
              type="button"
              icon="pi pi-arrow-left"
              severity="secondary"
              outlined
              @click="navigate"
            />
          </RouterLink>
          <div class="register__title">
            <FText as="h2" variant="heading-2">
              {{ t('v1.register') }}
            </FText>
            <FText as="p" color="--p-text-muted-color" variant="body-2">
              {{ t('v1.register.subtitle') }}
            </FText>
          </div>
        </template>

        <template #content>
          <form class="register__form" @submit.prevent="handleSubmit">
            <Message v-if="requestError" severity="error" size="small">
              {{ requestError }}
            </Message>

            <div class="register__field-grid">
              <label class="register__field">
                <FText as="span" variant="body-2-bold">
                  {{ t('v1.first.name') }}
                </FText>
                <InputText
                  id="register-first-name"
                  v-model="firstName"
                  autocomplete="given-name"
                  name="given-name"
                  :placeholder="t('v1.register.placeholder.first.name')"
                  :invalid="Boolean(errors.firstName)"
                />
                <small v-if="errors.firstName" class="register__error-message">
                  {{ errors.firstName }}
                </small>
              </label>

              <label class="register__field">
                <FText as="span" variant="body-2-bold">
                  {{ t('v1.last.name') }}
                </FText>
                <InputText
                  id="register-last-name"
                  v-model="lastName"
                  autocomplete="family-name"
                  name="family-name"
                  :placeholder="t('v1.register.placeholder.last.name')"
                  :invalid="Boolean(errors.lastName)"
                />
                <small v-if="errors.lastName" class="register__error-message">
                  {{ errors.lastName }}
                </small>
              </label>
            </div>

            <label class="register__field">
              <FText as="span" variant="body-2-bold">
                {{ t('v1.email') }}
              </FText>
              <InputText
                id="register-email"
                v-model="email"
                autocomplete="email"
                name="email"
                type="email"
                :placeholder="t('v1.register.placeholder.email')"
                :invalid="Boolean(errors.email)"
              />
              <small v-if="errors.email" class="register__error-message">
                {{ errors.email }}
              </small>
            </label>

            <label class="register__field">
              <FText as="span" variant="body-2-bold">
                {{ t('v1.password') }}
              </FText>
              <Password
                v-model="password"
                input-id="register-password"
                autocomplete="new-password"
                name="new-password"
                :placeholder="t('v1.register.placeholder.password')"
                :invalid="Boolean(errors.password)"
                toggle-mask
                fluid
              />
              <small v-if="errors.password" class="register__error-message">
                {{ errors.password }}
              </small>
            </label>

            <label class="register__field">
              <FText as="span" variant="body-2-bold">
                {{ t('v1.confirm.password') }}
              </FText>
              <Password
                v-model="confirmPassword"
                input-id="register-confirm-password"
                autocomplete="new-password"
                name="confirm-password"
                :placeholder="t('v1.register.placeholder.confirm.password')"
                :feedback="false"
                :invalid="Boolean(errors.confirmPassword)"
                toggle-mask
                fluid
              />
              <small
                v-if="errors.confirmPassword"
                class="register__error-message"
              >
                {{ errors.confirmPassword }}
              </small>
            </label>

            <div class="register__field">
              <label class="register__inline-field">
                <Checkbox v-model="termsAccepted" input-id="terms" binary />
                <FText as="span" variant="body-2">
                  {{ t('v1.register.terms') }}
                </FText>
              </label>
              <small
                v-if="errors.termsAccepted"
                class="register__error-message"
              >
                {{ errors.termsAccepted }}
              </small>
            </div>

            <Button
              type="submit"
              :label="t('v1.register')"
              :loading="authStore.isSubmitting"
            />
          </form>
        </template>
      </Card>
    </div>
  </FAuthPageEmpty>
</template>

<style scoped lang="scss">
.register {
  display: flex;
  width: min(100%, 560px);

  &__card {
    width: 100%;
  }

  &__back-button {
    margin-bottom: 8px;
  }

  &__title {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__field-grid {
    display: flex;
    gap: 16px;
  }

  &__field {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 8px;

    :deep(.p-inputtext),
    :deep(.p-password) {
      width: 100%;
    }
  }

  &__inline-field {
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  &__error-message {
    color: var(--p-red-500);
  }
}

@media (width <= 560px) {
  .register__field-grid {
    flex-direction: column;
  }
}
</style>
