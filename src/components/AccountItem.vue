<template>
  <n-card>
    <div class="account-row">
      <n-form-item
        label="Метка"
        :feedback="labelError ? 'Заполните хотя бы одну метку (макс 50 символов)' : ''"
        :validation-status="labelError ? 'error' : undefined"
      >
        <n-input
          v-model:value="labelInput"
          :maxlength="50"
          placeholder="Метки через ;"
          @blur="onLabelBlur"
        />
      </n-form-item>

      <n-form-item label="Тип записи">
        <n-select
          v-model:value="typeInput"
          :options="typeOptions"
          @update:value="onTypeChange"
          style="width: 130px;"
        />
      </n-form-item>

      <n-form-item
        label="Логин"
        :feedback="loginError ? 'Обязательное поле (макс 100 символов)' : ''"
        :validation-status="loginError ? 'error' : undefined"
      >
        <n-input
          v-model:value="loginInput"
          :maxlength="5"
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
          v-model:value="passwordInput"
          :maxlength="100"
          type="password"
          placeholder="Пароль"
          @blur="onPasswordBlur"
        />
      </n-form-item>

       <div class="btn-del-wrapper">
        <n-button type="error" class="btn_del" ghost @click="onDelete">
          Удалить
        </n-button>
       </div>
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { ref, toRefs, watch } from 'vue'
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

watch(account, (newAcc) => {
  labelInput.value = newAcc.label.map(l => l.text).join(';')
  loginInput.value = newAcc.login
  passwordInput.value = newAcc.password ?? ''
})

const typeOptions = [
  { label: 'LDAP', value: 'LDAP' },
  { label: 'Локальная', value: 'Локальная' }
]

function validateLabel(): boolean {
  labelError.value = false
  const labels = labelInput.value
    .split(';')
    .map(l => l.trim())
    .filter(Boolean)
  if (labels.some(l => l.length > 50)) {
    labelError.value = true
    return false
  }
  return true
}

function validateLogin(): boolean {
  loginError.value = false
  if (!loginInput.value || loginInput.value.length > 100) {
    loginError.value = true
    return false
  }
  return true
}

function validatePassword(): boolean {
  passwordError.value = false
  if (typeInput.value === 'Локальная') {
    if (!passwordInput.value || passwordInput.value.length > 100) {
      passwordError.value = true
      return false
    }
  }
  return true
}


function onLabelBlur() {
  if (validateLabel()) {
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
  if (validateLogin()) {
    emit('update', account.value.id, { login: loginInput.value })
  }
}
function onPasswordBlur() {
  if (validatePassword()) {
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
