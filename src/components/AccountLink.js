export function accountLink(account)
{
	return `/${account.nameId || account.id}`
}