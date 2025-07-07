<template>
  <div>
    <n-space align="center">
      <n-h2>Управление учетными записями</n-h2>
      <n-button @click="handleAddAccount" type="primary">Добавить</n-button>
    </n-space>
    <n-alert type="info" class="mt-3">
      В поле "Метка" можно указать несколько значений через <b>;</b>
    </n-alert>

    <div v-if="accounts.length === 0" class="mt-3 text-gray-400">
      Нет учетных записей. Добавьте первую!
    </div>

    <n-space vertical :size="12" class="mt-4">
      <AccountItem
        v-for="acc in accounts"
        :key="acc.id"
        :account="acc"
        @update="handleUpdateAccount"
        @delete="handleDeleteAccount"
      />
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { useAccountsStore } from '@/stores/accounts'
import AccountItem from './AccountItem.vue'
import { nanoid } from 'nanoid'
import type { Account } from '@/types/account'
import { computed } from 'vue'

const store = useAccountsStore()
const accounts = computed(() => store.accounts)

function handleAddAccount() {
  const newAcc: Account = {
    id: nanoid(),
    label: [],
    type: 'Локальная',
    login: '',
    password: '',
  }
  store.addAccount(newAcc)
}

function handleUpdateAccount(id: string, patch: Partial<Account>) {
  store.updateAccount(id, patch)
}

function handleDeleteAccount(id: string) {
  store.removeAccount(id)
}
</script>
