<script setup lang="ts">
import { Button, Card, Checkbox, InputText, Message, Password } from 'primevue';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { z } from 'zod';

import FAuthPageEmpty from '@/components/FAuthPageEmpty.vue';
import FFormField from '@/components/FFormField.vue';
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
  } catch {
    requestError.value = t('v1.general.error');

    return;
  }

  authStore.signOut();
  await router.replace(RoutePath.SignIn);
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
              <FFormField
                class="register__field"
                :error="errors.firstName"
                input-id="register-first-name"
                :label="t('v1.first.name')"
              >
                <InputText
                  id="register-first-name"
                  v-model="firstName"
                  autocomplete="given-name"
                  name="given-name"
                  :placeholder="t('v1.register.placeholder.first.name')"
                  :invalid="Boolean(errors.firstName)"
                />
              </FFormField>

              <FFormField
                class="register__field"
                :error="errors.lastName"
                input-id="register-last-name"
                :label="t('v1.last.name')"
              >
                <InputText
                  id="register-last-name"
                  v-model="lastName"
                  autocomplete="family-name"
                  name="family-name"
                  :placeholder="t('v1.register.placeholder.last.name')"
                  :invalid="Boolean(errors.lastName)"
                />
              </FFormField>
            </div>

            <FFormField
              class="register__field"
              :error="errors.email"
              input-id="register-email"
              :label="t('v1.email')"
            >
              <InputText
                id="register-email"
                v-model="email"
                autocomplete="email"
                name="email"
                type="email"
                :placeholder="t('v1.register.placeholder.email')"
                :invalid="Boolean(errors.email)"
              />
            </FFormField>

            <FFormField
              class="register__field"
              :error="errors.password"
              input-id="register-password"
              :label="t('v1.password')"
            >
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
            </FFormField>

            <FFormField
              class="register__field"
              :error="errors.confirmPassword"
              input-id="register-confirm-password"
              :label="t('v1.confirm.password')"
            >
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
            </FFormField>

            <FFormField class="register__field" :error="errors.termsAccepted">
              <label
                class="register__label register__label--inline"
                for="terms"
              >
                <Checkbox v-model="termsAccepted" input-id="terms" binary />
                <FText as="span" variant="body-2">
                  {{ t('v1.register.terms') }}
                </FText>
              </label>
            </FFormField>

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
    margin-bottom: var(--f-space-xs);
  }

  &__title {
    display: flex;
    flex-direction: column;
    gap: var(--f-space-md);
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--f-space-xl);
  }

  &__field-grid {
    display: flex;
    gap: var(--f-space-md);
  }

  &__field {
    flex: 1;

    :deep(.p-inputtext),
    :deep(.p-password) {
      width: 100%;
    }
  }

  &__label--inline {
    display: flex;
    align-items: flex-start;
    gap: var(--f-space-xs);
  }
}

@media (width <= 560px) {
  .register__field-grid {
    flex-direction: column;
  }
}
</style>
