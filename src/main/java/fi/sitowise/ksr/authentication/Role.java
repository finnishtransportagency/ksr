package fi.sitowise.ksr.authentication;


/**
 * Enumeration helper for KSR-roles.
 */
public class Role {
	
	private Role() {}
	
	/** The role admin. (=Pääkäyttäjä) */
	public static final String ROLE_ADMIN = "KSR_ROLE_ADMIN";
	
	/** The role updater. (=Ylläpitäjä) */
	public static final String ROLE_UPDATER = "KSR_ROLE_UPDATER";
	
	/** The role external updater. (=Ulkoinen ylläpitäjä) */
	public static final String ROLE_EXTERNAL_UPDATER = "KSR_ROLE_EXTERNAL_UPDATER";
	
	/** The role named user. (=Nimetty käyttäjä) */
	public static final String ROLE_NAMED_USER = "KSR_ROLE_NAMED_USER";
	
	/** The role user. (=Katselukäyttäjä) */
	public static final String ROLE_USER = "KSR_ROLE_USER";

	/**
	 * Check if role matches any of the defined roles.
	 *
	 * @param role Role to check against defined roles.
	 * @return True if role matches any of the defined roles otherwise false.
	 */
	static final boolean contains(String role) {
		return ROLE_ADMIN.equalsIgnoreCase(role)
				|| ROLE_UPDATER.equalsIgnoreCase(role)
				|| ROLE_EXTERNAL_UPDATER.equalsIgnoreCase(role)
				|| ROLE_NAMED_USER.equalsIgnoreCase(role)
				|| ROLE_USER.equalsIgnoreCase(role);
	}
}
