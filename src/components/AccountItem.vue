<template>
  <n-card>
    <n-space align="baseline">
      <n-form-item
        label="Метка"
        :feedback="labelError ? 'Заполните хотя бы одну метку (макс 50 символов)' : ''"
        :validation-status="labelError ? 'error' : undefined"
      >
        <n-input
          v-model="labelInput"
          :maxlength="50"
          placeholder="Метки через ;"
          @blur="onLabelBlur"
        />
      </n-form-item>

      <n-form-item label="Тип записи">
        <n-select
          v-model="typeInput"
          :options="typeOptions"
          @update:value="onTypeChange"
        />
      </n-form-item>

      <n-form-item
        label="Логин"
        :feedback="loginError ? 'Обязательное поле (макс 100 символов)' : ''"
        :validation-status="loginError ? 'error' : undefined"
      >
        <n-input
          v-model="loginInput"
          :maxlength="100"
          placeholder="Логин"
          @blur="onLoginBlur"
        />
      </n-form-item>

      <n-form-item
        v-if="typeInput === 'Локальная'"
        label="Пароль"
        :feedback="passwordError ? 'Обязательное поле (макс 100 символов)' : ''"
        :validation-status="passwordError ? 'error' : undefined"
      >
        <n-input
          v-model="passwordInput"
          :maxlength="100"
          type="password"
          placeholder="Пароль"
          @blur="onPasswordBlur"
        />
      </n-form-item>

      <n-button type="error" ghost @click="onDelete">
        Удалить
      </n-button>
    </n-space>
  </n-card>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import type { Account, AccountType } from '@/types/account'

const props = defineProps<{
  account: Account
}>()
const emit = defineEmits<{
  (e: 'update', id: string, patch: Partial<Account>): void
  (e: 'delete', id: string): void
}>()

const { account } = toRefs(props)

const labelInput = ref(account.value.label.map(l => l.text).join(';'))
const typeInput = ref<AccountType>(account.value.type)
const loginInput = ref(account.value.login)
const passwordInput = ref(account.value.password ?? '')

const labelError = ref(false)
const loginError = ref(false)
const passwordError = ref(false)

const typeOptions = [
  { label: 'LDAP', value: 'LDAP' },
  { label: 'Локальная', value: 'Локальная' }
]

function validate() {
  labelError.value = false
  loginError.value = false
  passwordError.value = false

  const labels = labelInput.value
    .split(';')
    .map(l => l.trim())
    .filter(Boolean)
  if (labels.some(l => l.length > 50)) labelError.value = true

  if (!loginInput.value || loginInput.value.length > 100) loginError.value = true

  if (typeInput.value === 'Локальная') {
    if (!passwordInput.value || passwordInput.value.length > 100) passwordError.value = true
  }

  return !labelError.value && !loginError.value && !passwordError.value
}

function onLabelBlur() {
  if (validate()) {
    emit('update', account.value.id, {
      label: labelInput.value
        .split(';')
        .map(l => l.trim())
        .filter(Boolean)
        .map(l => ({ text: l })),
    })
  }
}
function onLoginBlur() {
  if (validate()) {
    emit('update', account.value.id, { login: loginInput.value })
  }
}
function onPasswordBlur() {
  if (validate()) {
    emit('update', account.value.id, { password: passwordInput.value })
  }
}
function onTypeChange(value: AccountType) {
  typeInput.value = value
  emit('update', account.value.id, {
    type: value,
    password: value === 'LDAP' ? null : passwordInput.value
  })
}

function onDelete() {
  emit('delete', account.value.id)
}

</script>
