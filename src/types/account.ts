export type AccountType = 'LDAP' | 'Локальная';

export interface AccountLabel {
  text: string;
}

export interface Account {
  id: string;
  label: AccountLabel[];
  type: AccountType;
  login: string;
  password: string | null;
}
