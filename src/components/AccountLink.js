export function accountLink(account)
{
	return `/${account.idAlias || account.id}`
}