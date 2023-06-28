export function getRoleFromToken(instance, accounts) {
    if (accounts && accounts.length > 0) {
        const account = instance.getAccountByUsername(accounts[0].username);
        if (account) {
            const idTokenClaims = account.idTokenClaims;
            const roles = idTokenClaims['roles'];
            if (roles && roles.length > 0) {
                return roles[0];  // assumes each user has exactly one role
            }
        }
    }
    return null;
}