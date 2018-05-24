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
}
