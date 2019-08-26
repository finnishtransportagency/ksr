package fi.sitowise.ksr.authentication;

import java.util.Collection;
import java.util.List;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.Base64Utils;

/**
 * User entity for storing authentication information as principal.
 */
@SuppressWarnings("serial")
public class User implements UserDetails {
    
    private String username;
    
    private String firstName;
    
    private String lastName;
    
    private String email;
    
    private String mobile;
    
    private String organization;

    private List<String> groups;

    private static final String BASE64_PREFIX = "=?UTF-8?B?";

    private static final String BASE64_SUFFIX = "?=";
    
    public User(String username, String firstName, String lastName, String email, String mobile, String organization, List<String> groups) {
        this.username = username;
        this.firstName = decodeBase64String(firstName);
        this.lastName = decodeBase64String(lastName);
        this.email = email;
        this.mobile = mobile;
        this.organization = organization;
        this.groups = groups;
    }

    private String decodeBase64String(String value) {
        if (value == null) {
            return "";
        }

        if (value.startsWith(BASE64_PREFIX)) {
            String base64Name = value.substring(BASE64_PREFIX.length(), (value.length() - BASE64_SUFFIX.length()));
            return new String(Base64Utils.decodeFromString(base64Name));
        }
        
        return value;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
    	if (groups != null) {
    		String[] groupNames = groups.stream()
                    .filter(this::groupNameFilter)
                    .map(String::toUpperCase).toArray(size -> new String[size]);
    		return AuthorityUtils.createAuthorityList(groupNames);
    	}
    	return AuthorityUtils.createAuthorityList();
    }
    
    private boolean groupNameFilter(String groupName) {
    	switch (groupName.toUpperCase()) {
    		case Role.ROLE_ADMIN:
            case Role.ROLE_EXTERNAL_UPDATER:
            case Role.ROLE_UPDATER:
            case Role.ROLE_NAMED_USER:
            case Role.ROLE_USER:
    			return true;
    		default:
    			return false;
    	}
    }
    
    @Override
    @JsonIgnore
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return false;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return false;
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return false;
    }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return true;
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + " {username=" + Objects.toString(this.username) + "}";
    }

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getOrganization() {
		return organization;
	}

	public void setOrganization(String organization) {
		this.organization = organization;
	}

	public void setGroups(List<String> groups) {
		this.groups = groups;
	}
    
}
