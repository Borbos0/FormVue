import { defineStore } from 'pinia'
import type { Account } from '@/types/account'

const LS_KEY = 'accounts'

function loadFromStorage(): Account[] {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToStorage(accounts: Account[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(accounts))
}

export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    accounts: loadFromStorage() as Account[],
  }),
  actions: {
    addAccount(account: Account) {
      this.accounts.push(account)
      saveToStorage(this.accounts)
    },
    updateAccount(id: string, patch: Partial<Account>) {
      const idx = this.accounts.findIndex(acc => acc.id === id)
      if (idx !== -1) {
        this.accounts[idx] = { ...this.accounts[idx], ...patch }
        console.log(this.accounts[idx])
        saveToStorage(this.accounts)
      }
    },
    removeAccount(id: string) {
      this.accounts = this.accounts.filter(acc => acc.id !== id)
      saveToStorage(this.accounts)
    },
    setAccounts(accounts: Account[]) {
      this.accounts = accounts
      saveToStorage(accounts)
    }
  }
})
