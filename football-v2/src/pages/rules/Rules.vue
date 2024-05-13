<script lang="ts" setup>
import PageWrapper from "@/components/PageWrapper.vue";
import Card from "primevue/card";
</script>

<template>
  <PageWrapper>
    <Card class="rules-wrapper">
      <template #title>
        <h1>{{ $t("RULES") }}</h1>
      </template>
      <template #content>
        <div class="rules-section">
          {{ $t("RULE_1") }}
        </div>
        <div class="rules-section">
          {{ $t("RULE_2") }}
        </div>
        <div class="rules-section">
          {{ $t("RULE_3") }}
        </div>
        <div class="rules-section">
          {{ $t("RULE_4") }}
        </div>
        <div class="rules-section">
          {{ $t("RULE_5") }}
        </div>
        <div class="rules-section">
          {{ $t("RULE_6") }}
        </div>
        <div class="rules-section">
          {{ $t("RULE_7") }}
        </div>
        <div class="rules-section">
          {{ $t("RULE_8") }}
        </div>
        <div class="rules-section">
          {{ $t("RULE_9") }}
        </div>
        <div class="rules-section">
          {{ $t("RULE_10") }}
        </div>
        <div class="rules-section">
          {{ $t("RULE_11") }}
        </div>
        <div class="rules-section">
          {{ $t("RULE_12") }}
        </div>
        <div class="rules-section">
          {{ $t("RULE_13") }}
        </div>
      </template>
    </Card>
  </PageWrapper>
</template>

<style lang="scss">
.rules-wrapper {
  width: 100%;
  background: #ffffff80;
  backdrop-filter: blur(20px);
  padding: 12px 0;

  .p-card-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}
</style>
