export function accountName(account) {
	if (account.name) {
		return account.name
	}
	return `${account.firstName} ${account.lastName}`
}