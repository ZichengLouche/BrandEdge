function authenticate(username, password) 
{
	var authResult = {};
	
	var server = "ldap://bluepages.ibm.com:636";
//	var server = "ldap://tstbluepages.mkm.can.ibm.com:636";
	var searchAttrId = "mail";
	var searchAttrValue = username;
    
	var searchBase = "ou=bluepages,o=ibm.com";

	var props = new java.util.Properties();
	
	props.put("java.naming.factory.initial", "com.sun.jndi.ldap.LdapCtxFactory");
	props.put("java.naming.provider.url", server);
	props.put("java.naming.security.protocol", "ssl");
	props.put("java.naming.ldap.factory.socket", "javax.net.ssl.SSLSocketFactory");
	props.put("java.naming.ldap.derefAliases", "never");
	props.put("java.naming.ldap.version", "3");
	
	//WL.Logger.error("[debug] JNDI_PROPERTIES_FOR_SEARCH=" + props);
	
	var ctx = null;
	var results = null;
	var DN = "";
	
	try
	{
		ctx = new javax.naming.ldap.InitialLdapContext(props, null);
		
		var attrIds = [ "uid","c","hrFirstName", "hrLastName", "ibm-allgroups" ];
		var searchFilter = "(" + searchAttrId + "=" + searchAttrValue + ")";
		
		var constraints = new javax.naming.directory.SearchControls();
		constraints.setSearchScope(2);
		constraints.setReturningAttributes(attrIds);
		
		constraints.setCountLimit(1);
		
		try
		{
			results = ctx.search(searchBase, searchFilter, constraints);
			
			if (results.hasMore()) 
			{
				var sr = results.next();
				
				if (sr != null) 
				{
					DN = sr.getName() + "," + searchBase;
					
					var returnedAttributes = sr.getAttributes()
					var returnedGroups = _getAtrribute(returnedAttributes, "ibm-allgroups", "cn");
					var returnedUID = _getAtrribute(returnedAttributes, "uid");
					var returnedC = _getAtrribute(returnedAttributes, "c");
					var returnedSN = _getAtrribute(returnedAttributes, "hrLastName");
					var returnedName = _getAtrribute(returnedAttributes, "hrFirstName");
					
					if (Array.isArray(returnedName))
					{
						var tempName = returnedName[0];
						
						for (x in returnedName)
						{
							if (tempName.length > returnedName[x].length) tempName = returnedName[x];
						}
						
						returnedName = tempName;
					}
					
					var ldapResults = {
							"groups": returnedGroups,
							"uid": returnedUID,
							"country": returnedC,
							"sirName": returnedSN,
							"givenName": returnedName
						};
				}
			}
			
			if (results != null) 
			{
				try
				{
					results.close();
				}
				catch (err) 
				{
					
				}

				results = null;
			}
			
			if (ctx != null) 
			{
				try
				{
					ctx.close();
				}
				catch (err) {}
			}
			
			if (DN == "")
			{
				authResult.success = false;
				authResult.message = "User not found in Enterprise Directory";
				authResult.rawMessage = "User not found in Enterprise Directory";
			}
			else
			{
				props.put("java.naming.security.authentication", "simple");
				props.put("java.naming.security.principal", DN);
				props.put("java.naming.security.credentials", password);
				
				//WL.Logger.error("[debug]: JNDI_PROPERTIES_FOR_BIND=" + props);
				
				try
				{
					ctx = new javax.naming.ldap.InitialLdapContext(props, null);
					
					authResult.success = true;
					authResult.message = "Login successful!!";
					authResult.ldapResults = ldapResults;
				}
				catch (err) 
				{
					WL.Logger.error("BluePages login error =" + err);
					if (err.message.indexOf("javax.naming.AuthenticationException") > -1)
					{
						authResult.success = false;
						authResult.message = "Invalid Credentials";
						authResult.rawMessage = err.message;
					}
					else
					{
						authResult.success = false;
						authResult.message = err.message;
						authResult.rawMessage = err.message;
					}
				}
				finally 
				{
					if (ctx != null) 
					{
						try
						{
							ctx.close();
						}
						catch (err) {}
				
						ctx = null;
					}
				}
			}
		}
		catch (err)
		{
			WL.Logger.error("BluePages search error =" + err);
			
			authResult.success = false;
			authResult.message = "User searching for user in Enterprise Directory";
			authResult.rawMessage = err.message;
		}
	}
	catch (err)
	{
		WL.Logger.error("BluePages setup error =" + err);
		
		authResult.success = false;
		authResult.message = err.message;
		authResult.rawMessage = err.message;
	}
	
	return { result: authResult };
}

function getGroups(username) 
{
	var authResult = {};
	
	var server = "ldap://bluepages.ibm.com:636";
//	test server
//	var server = "ldap://tstbluepages.mkm.can.ibm.com:636";
	var searchAttrId = "email";
	var searchAttrValue = username;
    
	var searchBase = "ou=bluepages,o=ibm.com";
	//var groupSearchBase = "ou=memberList,ou=ibmgroups,o=ibm.com";

	var props = new java.util.Properties();
	
	props.put("java.naming.factory.initial", "com.sun.jndi.ldap.LdapCtxFactory");
	props.put("java.naming.provider.url", server);
	props.put("java.naming.security.protocol", "ssl");
	props.put("java.naming.ldap.factory.socket", "javax.net.ssl.SSLSocketFactory");
	props.put("java.naming.ldap.derefAliases", "never");
	props.put("java.naming.ldap.version", "3");
	
	//WL.Logger.error("[debug] JNDI_PROPERTIES_FOR_SEARCH=" + props);
	
	var ctx = null;
	var results = null;
	var DN = "";
	
	try
	{
		ctx = new javax.naming.ldap.InitialLdapContext(props, null);
		
		var attrIds = [ "uid","c","hrFirstName", "hrLastName", "ibm-allgroups" ];
		var searchFilter = "(" + searchAttrId + "=" + searchAttrValue + ")";
		
		var constraints = new javax.naming.directory.SearchControls();
		constraints.setSearchScope(2);
		constraints.setReturningAttributes(attrIds);
		
		constraints.setCountLimit(1);
		
		try
		{
			results = ctx.search(searchBase, searchFilter, constraints);
			
			if (results.hasMore()) 
			{
				var sr = results.next();
				
				if (sr != null) 
				{
					var returnedAttributes = sr.getAttributes()
					var returnedGroups = _getAtrribute(returnedAttributes, "ibm-allgroups", "cn");
					var returnedUID = _getAtrribute(returnedAttributes, "uid");
					var returnedC = _getAtrribute(returnedAttributes, "c");
					var returnedSN = _getAtrribute(returnedAttributes, "hrLastName");
					var returnedName = _getAtrribute(returnedAttributes, "hrFirstName");
					
					var ldapResults = {
							"groups": returnedGroups,
							"uid": returnedUID,
							"country": returnedC,
							"sirName": returnedSN,
							"givenName": returnedName
						};
					
					authResult.success = true;
					authResult.message = "Lookup successful!!";
					authResult.ldapResults = ldapResults;
				}
			}
			
		}
		catch (err)
		{
			return err;
			WL.Logger.error("BluePages search error =" + err);
			
			authResult.success = false;
			authResult.message = "User searching for user in Enterprise Directory";
			authResult.rawMessage = err.message;
		}
	}
	catch (err)
	{
		return err;
		WL.Logger.error("BluePages setup error =" + err);
		
		authResult.success = false;
		authResult.message = err.message;
		authResult.rawMessage = err.message;
	}
	
	return { result: authResult };
}

function _getAtrribute(ldapObject, attribute, subAttribute)
{
	if (attribute == null) return null;
	
	var attributeObject = ldapObject.get(attribute);
	if (attributeObject == null) return null;
	
	var attributeList = attributeObject.toString();
	
	var tempString = attributeList.substring(attribute.length + 2);
	
	if (subAttribute != null)
	{
		var tempArray = tempString.split(",");
		var newArray = [];
		
		var subAttr = subAttribute + "=";
		var ptr = -1;
		
		for (x in tempArray)
		{
			ptr = tempArray[x].indexOf(subAttr);
			if (ptr > -1)
			{
				newArray.push(tempArray[x].substring(ptr+subAttr.length));
			}
		}
		
		return newArray;
	}
	else
	{
		return tempString;
	}
	
}