package fi.sitowise.ksr.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import fi.sitowise.ksr.authentication.OAMAuthenticationProvider;
import fi.sitowise.ksr.authentication.OAMFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
	private final OAMAuthenticationProvider oamAuthenticationProvider;
	
	private final OAMFilter oamFilter;
	
	@Autowired
	public SecurityConfig(OAMAuthenticationProvider oamAuthenticationProvider, OAMFilter oamFilter) {
		this.oamAuthenticationProvider = oamAuthenticationProvider;
		this.oamFilter = oamFilter;
	}
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
		http.csrf().disable().httpBasic().disable().addFilterBefore(this.oamFilter, BasicAuthenticationFilter.class)
			.authenticationProvider(this.oamAuthenticationProvider);
	}
}
