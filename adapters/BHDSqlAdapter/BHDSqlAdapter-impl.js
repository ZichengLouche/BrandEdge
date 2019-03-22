var myDataSource = "jdbc/bhd";
//Modify by Fx begin add detailUrl  
var addDetailUrlField = "URL, \"USER\", PW, URL_TYPE ";

function executeSql(prepareSql, allColumn) {
    var ctx = new javax.naming.InitialContext();
    var ds = ctx.lookup(myDataSource);
	var con = ds.getConnection();
	var statement = con.prepareStatement(prepareSql);
	var resultSet = statement.executeQuery();
	var result = [];
	while (resultSet.next()) {
		var res = {};
		for (var index in allColumn) {
			res[allColumn[index]] = resultSet.getString(allColumn[index]);
		}
		result.push(res);
	}
	resultSet.close();
	statement.close();
	resultSet = null;
	statement = null;
	con = null;
	
	return { "resultSet": result };
}

function quoteWrap(str) {
	return "'" + str.toString().trim() + "'";
}
//Modify by Fx end
var countryListStatement   = WL.Server.createSQLStatement(
		"SELECT " +
			"COUNTRY_CODE, " +
			"COUNTRY_NAME " +
		"FROM BHMS.V_COUNTRY " +
		"ORDER BY COUNTRY_NAME"
);

function getCountryList(param) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : countryListStatement,
		parameters : [param]
	});
}

//xmt 2015.7.21 12:15
var getWWIotDashboardListsReportStatement = WL.Server.createSQLStatement(
	 "SELECT " + 
		  "CASE " +
			  "WHEN IOT_NAME = 'AS' THEN 'AP' " +
			  "WHEN IOT_NAME = 'EP' THEN 'EU' " +
			  "WHEN IOT_NAME = 'EA' THEN 'MEA' " +
			  "WHEN IOT_NAME = 'CG' THEN 'GCG' " +
			  "WHEN IOT_NAME = 'JN' THEN 'Japan' " +
			  "WHEN IOT_NAME = 'AM' THEN 'NA' " +
			  "ELSE IOT_NAME " +
		  "END AS IOT_NAME, " +
		  "COUNTRY_NAME, " +
		  "CASE " +
		  "WHEN CONSTITUENTS = 'CLIENTS & PROSPECTS' THEN 1 " +  
		  "WHEN CONSTITUENTS = 'INFLUENCERS' THEN 11 " +   
		  "WHEN CONSTITUENTS = 'DEVELOPERS' THEN 19 " +  
		  "WHEN CONSTITUENTS = 'EMPLOYEES' THEN 20 " +   
			  "ELSE NULL " +
		  "END AS CONSTITUENTS_ORDER, " +
		  "CONSTITUENTS, " +
		  "COLUMN, " +
		  "CASE " +
		  "WHEN METRIC_CODE = 'INT3' AND TRIM(DISPLAY_NAME) = 'New Client Acquisition [IBM SDFDM]-new client acquisition' THEN 7 " +
		  "WHEN METRIC_CODE = 'INT3' AND TRIM(DISPLAY_NAME) = 'New Client Acquisition [IBM SDFDM]-new to brand' THEN 10 " +
		  "ELSE SEQUENCE " +
		  "END 	AS SEQUENCE, " +
		  "CASE " +
			  "WHEN METRIC_CODE = 'BHM1' THEN 'Brand' " +
			  "WHEN METRIC_CODE = 'BHM10' THEN 'Provider' " +
			  "WHEN METRIC_CODE = 'PR20' THEN 'Mentions Sent''t' " +
			  "WHEN METRIC_CODE = 'BHM5' THEN 'Relevance' " +
			  "WHEN METRIC_CODE = 'BHM6' THEN 'Optimize'	" +	
			  "WHEN METRIC_CODE = 'INT1' THEN 'Market Share' " +
			  "WHEN METRIC_CODE = 'BHM3' THEN 'Preference' " +
			  "WHEN METRIC_CODE = 'BHM4' THEN 'Engagement' " +
			  "WHEN METRIC_CODE = 'BHM7' THEN 'Proposal' " +
			  "WHEN METRIC_CODE = 'BHM8' THEN 'Recommended' " +
			  "WHEN METRIC_CODE = 'PR25' THEN 'Ampf''d Sent''t'	" +	
			  "WHEN METRIC_CODE = 'BHM9' THEN 'Likelihood' " +
			  "WHEN METRIC_CODE = 'PR24' THEN 'Social Share'	" +	
			  "WHEN METRIC_CODE = 'PR1' THEN 'Mentions SOV' " +
			  "WHEN METRIC_CODE = 'INT2' THEN 'Factored Pipeline' " +
			  "WHEN METRIC_CODE = 'PR23' THEN 'Orig Sent''t' " +
			  "WHEN METRIC_CODE = 'INT3' AND TRIM(DISPLAY_NAME) = 'New Client Acquisition [IBM SDFDM]-new client acquisition' THEN 'Client Acquisition' " +
			  "WHEN METRIC_CODE = 'INT3' AND TRIM(DISPLAY_NAME) = 'New Client Acquisition [IBM SDFDM]-new to brand' THEN 'New to Brand' " +
			  "WHEN METRIC_CODE = 'INT4' THEN 'Revenue Client' " +
			  "WHEN METRIC_CODE = 'INT5' THEN 'Client Attrition' " +
			  "WHEN METRIC_CODE = 'CEM1' THEN 'CEM-R' " +
			  "WHEN METRIC_CODE = 'CEM5' THEN 'CEM-T' " +
			  "WHEN METRIC_CODE = 'INT6' THEN 'Profile' " +
			  "WHEN METRIC_CODE = 'PR6' AND COLUMN = 1 THEN 'Influencers SOV' " +
			  "WHEN METRIC_CODE = 'PR6' AND COLUMN = 2 THEN 'Mentions SOV' " +
			  "WHEN METRIC_CODE = 'PR4' THEN 'Identified' " +
			  "WHEN METRIC_CODE = 'PR5' THEN 'Reach' " +
			  "WHEN METRIC_CODE = 'PR21' THEN 'Mentions Sent''t' " +
			  "WHEN METRIC_CODE = 'PR8' THEN 'Engage' " +
			  "WHEN METRIC_CODE = 'PR19' THEN 'IBMers' " +
			  "WHEN METRIC_CODE = 'INT7' THEN 'ibm.com' " +
			  "WHEN METRIC_CODE = 'PR28' THEN 'Amplf''d SOV' " +
			  "WHEN METRIC_CODE = 'PR27' AND COLUMN = 1 THEN 'Influencers Orig' " +
			  "WHEN METRIC_CODE = 'PR27' AND COLUMN = 2 THEN 'Orig SOV' " +
			  "WHEN METRIC_CODE = 'PR12' THEN 'Inflr SOV' " +
			  "WHEN METRIC_CODE = 'PR22' THEN 'Ampf''d Sent''t' " +
			  "WHEN METRIC_CODE = 'PR21' THEN 'Influencers Sentiment' " +
			  "WHEN METRIC_CODE = 'PR16' THEN 'Orig Sent''t' " +
			  "WHEN METRIC_CODE = 'NDS1' THEN 'Consideration' " +
			  "WHEN METRIC_CODE = 'PR14' THEN 'Mentions SOV' " +
			  "WHEN METRIC_CODE = 'NDS3' THEN 'Familiarity' " +
			  "WHEN METRIC_CODE = 'NDS8' THEN 'Existing Environment' " +
			  "WHEN METRIC_CODE = 'PR31' THEN 'Mentions Sent''t' " +
			  "WHEN METRIC_CODE = 'NDS9' THEN 'APIs' " +
			  "WHEN METRIC_CODE = 'NDS10' THEN 'Used Quickly' " +
			  "WHEN METRIC_CODE = 'NDS5' THEN 'Use Platform' " +
			  "WHEN METRIC_CODE = 'PR15' THEN 'Engagement' " +
			  "WHEN METRIC_CODE = 'INT12' THEN 'Registrants' " +
			  "WHEN METRIC_CODE = 'NDS4' THEN 'Trial' " +
			  "WHEN METRIC_CODE = 'NDS2' THEN 'provider' " +
			  "WHEN METRIC_CODE = 'NDS7' THEN 'Recommended' " +
			  "WHEN METRIC_CODE = 'PR29' THEN 'Orig SOV' " +
			  "WHEN METRIC_CODE = 'PR18' THEN 'Ampf''d SOV' " +
			  "WHEN METRIC_CODE = 'NDS6' THEN 'Likelihood' " +
			  "WHEN METRIC_CODE = 'PR30' THEN 'Orig Sent''t' " +
			  "WHEN METRIC_CODE = 'PR32' THEN 'Ampf''d Sent''t' " +
			  "WHEN METRIC_CODE = 'EMP9' THEN 'Engagement' " +
			  "WHEN METRIC_CODE = 'EMP11' THEN 'Proud' " +
			  "WHEN METRIC_CODE = 'EMP1' THEN 'Great' " +
			  "WHEN METRIC_CODE = 'EMP7' THEN 'Recommend' " +
			  "WHEN METRIC_CODE = 'INT16' THEN 'Growth Gap' " +
			  "ELSE NULL " +
		  "END 	AS SHORT_NAME, " +
		  "CASE " +
		  "WHEN METRIC_CODE = 'BHM1' THEN 'Brand' " +
		  "WHEN METRIC_CODE = 'BHM10' THEN 'Category Awareness' " +
		  "WHEN METRIC_CODE = 'PR20' THEN 'Mentions Sent''t' " +
		  "WHEN METRIC_CODE = 'BHM5' THEN 'Relevance' " +
		  "WHEN METRIC_CODE = 'BHM6' THEN 'Optimize'	" +	
		  "WHEN METRIC_CODE = 'INT1' THEN 'Market Share' " +
		  "WHEN METRIC_CODE = 'BHM3' THEN 'Preference' " +
		  "WHEN METRIC_CODE = 'BHM4' THEN 'Engagement' " +
		  "WHEN METRIC_CODE = 'BHM7' THEN 'Proposal' " +
		  "WHEN METRIC_CODE = 'BHM8' THEN 'Recommended' " +
		  "WHEN METRIC_CODE = 'PR25' THEN 'Ampf''d Sent''t'	" +	
		  "WHEN METRIC_CODE = 'BHM9' THEN 'Likelihood' " +
		  "WHEN METRIC_CODE = 'PR24' THEN 'Social Share'	" +	
		  "WHEN METRIC_CODE = 'PR1' THEN 'Mentions SOV' " +
		  "WHEN METRIC_CODE = 'INT2' THEN 'Factored Pipeline' " +
		  "WHEN METRIC_CODE = 'PR23' THEN 'Orig Sent''t' " +
		  "WHEN METRIC_CODE = 'INT3' AND TRIM(DISPLAY_NAME) = 'New Client Acquisition [IBM SDFDM]-new client acquisition' THEN 'Client Acquisition' " +
		  "WHEN METRIC_CODE = 'INT3' AND TRIM(DISPLAY_NAME) = 'New Client Acquisition [IBM SDFDM]-new to brand' THEN 'New to Brand' " +
		  "WHEN METRIC_CODE = 'INT4' THEN 'Revenue Client' " +
		  "WHEN METRIC_CODE = 'INT5' THEN 'Client Attrition' " +
		  "WHEN METRIC_CODE = 'CEM1' THEN 'CEM-R' " +
		  "WHEN METRIC_CODE = 'CEM5' THEN 'CEM-T' " +
		  "WHEN METRIC_CODE = 'INT6' THEN 'Profile' " +
		  "WHEN METRIC_CODE = 'PR6' AND COLUMN = 1 THEN 'Influencers SOV' " +
		  "WHEN METRIC_CODE = 'PR6' AND COLUMN = 2 THEN 'Mentions SOV' " +
		  "WHEN METRIC_CODE = 'PR4' THEN 'Identified' " +
		  "WHEN METRIC_CODE = 'PR5' THEN 'Reach' " +
		  "WHEN METRIC_CODE = 'PR21' THEN 'Mentions Sent''t' " +
		  "WHEN METRIC_CODE = 'PR8' THEN 'Engage' " +
		  "WHEN METRIC_CODE = 'PR19' THEN 'IBMers' " +
		  "WHEN METRIC_CODE = 'INT7' THEN 'ibm.com' " +
		  "WHEN METRIC_CODE = 'PR28' THEN 'Amplf''d SOV' " +
		  "WHEN METRIC_CODE = 'PR27' AND COLUMN = 1 THEN 'Influencers Orig' " +
		  "WHEN METRIC_CODE = 'PR27' AND COLUMN = 2 THEN 'Orig SOV' " +
		  "WHEN METRIC_CODE = 'PR12' THEN 'Inflr SOV' " +
		  "WHEN METRIC_CODE = 'PR22' THEN 'Ampf''d Sent''t' " +
		  "WHEN METRIC_CODE = 'PR21' THEN 'Influencers Sentiment' " +
		  "WHEN METRIC_CODE = 'PR16' THEN 'Orig Sent''t' " +
		  "WHEN METRIC_CODE = 'NDS1' THEN 'Consideration' " +
		  "WHEN METRIC_CODE = 'PR14' THEN 'Mentions SOV' " +
		  "WHEN METRIC_CODE = 'NDS3' THEN 'Familiarity' " +
		  "WHEN METRIC_CODE = 'NDS8' THEN 'Existing Environment' " +
		  "WHEN METRIC_CODE = 'PR31' THEN 'Mentions Sent''t' " +
		  "WHEN METRIC_CODE = 'NDS9' THEN 'APIs' " +
		  "WHEN METRIC_CODE = 'NDS10' THEN 'Used Quickly' " +
		  "WHEN METRIC_CODE = 'NDS5' THEN 'Use Platform' " +
		  "WHEN METRIC_CODE = 'PR15' THEN 'Engagement' " +
		  "WHEN METRIC_CODE = 'INT12' THEN 'Registrants' " +
		  "WHEN METRIC_CODE = 'NDS4' THEN 'Trial' " +
		  "WHEN METRIC_CODE = 'NDS2' THEN 'provider' " +
		  "WHEN METRIC_CODE = 'NDS7' THEN 'Recommended' " +
		  "WHEN METRIC_CODE = 'PR29' THEN 'Orig SOV' " +
		  "WHEN METRIC_CODE = 'PR18' THEN 'Ampf''d SOV' " +
		  "WHEN METRIC_CODE = 'NDS6' THEN 'Likelihood' " +
		  "WHEN METRIC_CODE = 'PR30' THEN 'Orig Sent''t' " +
		  "WHEN METRIC_CODE = 'PR32' THEN 'Ampf''d Sent''t' " +
		  "WHEN METRIC_CODE = 'EMP9' THEN 'Engagement' " +
		  "WHEN METRIC_CODE = 'EMP11' THEN 'Proud' " +
		  "WHEN METRIC_CODE = 'EMP1' THEN 'Great' " +
		  "WHEN METRIC_CODE = 'EMP7' THEN 'Recommend' " +
		  "WHEN METRIC_CODE = 'INT16' THEN 'Growth Gap' " +
		  "ELSE NULL " +
		  "END 	AS CAMSS_SHORT_NAME, " +
		  "METRIC_CODE, " +
		  "DISPLAY_NAME, " +
		  "CAMS_DISPLAY_NAME, " +
		  "EMP_RATING, " +
		  "YEAR, " +
		  "MONTH, " +
		  "QUARTER, " +
		  "WEEK(START_DATE) AS WEEK, " +
		  "DATE_PERIOD_TYPE, " +
		  "IOT_WEIGHTINGS, " +
		  "WW_WEIGHTINGS, " +
		  "DEV_IOT_WEIGHTINGS, " +
		  "DEV_WW_WEIGHTINGS, " +
//Market
		  "COLOR_SCORE, " +
		  "P_COLOR_SCORE, " +
		  "RATING, " +
		  "P_RATING, " +
		  "TOP_COMPANY_NAME, " +
		  "IBM_RANKING, " +
//Cognitive
		  "COGNITIVE_COLOR_SCORE, " +
		  "COGNITIVE_P_COLOR_SCORE, " +
		  "COGNITIVE_RATING, " +
		  "COGNITIVE_P_RATING, " +
		  "COGNITIVE_TOP_COMPANY_NAME, " +
		  "COGNITIVE_IBM_RANKING, " +
//CLOUD
		  "CLOUD_COLOR_SCORE, " +
		  "CLOUD_P_COLOR_SCORE, " +
		  "CLOUD_RATING, " +
		  "CLOUD_P_RATING, " +
		  "CLOUD_TOP_COMPANY_NAME, " +
		  "CLOUD_IBM_RANKING, " +
//ANALYTICS
		  "ANALYTICS_COLOR_SCORE, " +
		  "ANALYTICS_P_COLOR_SCORE, " +
		  "ANALYTICS_RATING, " +
		  "ANALYTICS_P_RATING, " +
		  "ANALYTICS_TOP_COMPANY_NAME, " +
		  "ANALYTICS_IBM_RANKING, " +
//MOBILE
		  "MOBILE_COLOR_SCORE, " +
		  "MOBILE_P_COLOR_SCORE, " +
		  "MOBILE_RATING, " +
		  "MOBILE_P_RATING, " +
		  "MOBILE_TOP_COMPANY_NAME, " +
		  "MOBILE_IBM_RANKING, " +
//SOCIAL
		  "SOCIAL_COLOR_SCORE, " +
		  "SOCIAL_P_COLOR_SCORE, " +
		  "SOCIAL_RATING, " +
		  "SOCIAL_P_RATING, " +
		  "SOCIAL_TOP_COMPANY_NAME, " +
		  "SOCIAL_IBM_RANKING, " +
//SECURITY
		  "SECURITY_COLOR_SCORE, " +
		  "SECURITY_P_COLOR_SCORE, " +
		  "SECURITY_RATING, " +
		  "SECURITY_P_RATING, " +
		  "SECURITY_TOP_COMPANY_NAME, " +
		  "SECURITY_IBM_RANKING, " +
//INT16 WWIOT
		  "IOT_RATING, " +
		  "WW_IOT_RATING, " +
		  "IOT_P_RATING, " +
		  "WW_IOT_P_RATING " +
     "FROM V_BHMS_DASHBOARD_REPORTING_IOT_LISTS_DATA " +
	"WHERE CURRENT = 'Y' " +
	  "AND IOT_NAME IS NOT NULL " +
//	  "AND IOT_NAME <> 'XX' AND COUNTRY_NAME <> 'Indonesia' " +
	  "AND METRIC_CODE <> 'PR12' " +
	  "AND IOT_NAME <> 'XX' " +
 "ORDER BY IOT_NAME, COUNTRY_NAME, CONSTITUENTS_ORDER, COLUMN, SEQUENCE"
);

var getWWIotDashboardListsReportByMonthStatement = WL.Server.createSQLStatement(
			"SELECT " +   
		  		  "CASE " +  
					  "WHEN P.IOT_NAME = 'AS' THEN 'AP' " +  
					  "WHEN P.IOT_NAME = 'EP' THEN 'EU' " +  
					  "WHEN P.IOT_NAME = 'EA' THEN 'MEA' " +  
					  "WHEN P.IOT_NAME = 'CG' THEN 'GCG' " +  
					  "WHEN P.IOT_NAME = 'JN' THEN 'Japan' " +  
					  "WHEN P.IOT_NAME = 'AM' THEN 'NA' " +  
					  "ELSE P.IOT_NAME " +  
				  "END AS IOT_NAME, " +  
				  "P.COUNTRY_NAME, " +  
				  "CASE " +  
					  "WHEN P.CONSTITUENTS = 'CLIENTS & PROSPECTS' THEN 1 " +  
					  "WHEN P.CONSTITUENTS = 'INFLUENCERS' THEN 11 " +   
					  "WHEN P.CONSTITUENTS = 'DEVELOPERS' THEN 19 " +  
					  "WHEN P.CONSTITUENTS = 'EMPLOYEES' THEN 20 " +   
					  "ELSE null " +  
				  "END AS CONSTITUENTS_ORDER, " +  
				  "P.CONSTITUENTS, " +  
				  "P.COLUMN, " +  
				  "CASE " +
				  "WHEN METRIC_CODE = 'INT3' AND TRIM(DISPLAY_NAME) = 'New Client Acquisition [IBM SDFDM]-new client acquisition' THEN 7 " +
				  "WHEN METRIC_CODE = 'INT3' AND TRIM(DISPLAY_NAME) = 'New Client Acquisition [IBM SDFDM]-new to brand' THEN 10 " +
				  "ELSE P.SEQUENCE " +
				  "END 	AS SEQUENCE, " +
				  "CASE " +
				  "WHEN METRIC_CODE = 'BHM1' THEN 'Brand' " +
				  "WHEN METRIC_CODE = 'BHM10' THEN 'Provider' " +
				  "WHEN METRIC_CODE = 'PR20' THEN 'Mentions Sent''t' " +
				  "WHEN METRIC_CODE = 'BHM5' THEN 'Relevance' " +
				  "WHEN METRIC_CODE = 'BHM6' THEN 'Optimize'	" +	
				  "WHEN METRIC_CODE = 'INT1' THEN 'Market Share' " +
				  "WHEN METRIC_CODE = 'BHM3' THEN 'Preference' " +
				  "WHEN METRIC_CODE = 'BHM4' THEN 'Engagement' " +
				  "WHEN METRIC_CODE = 'BHM7' THEN 'Proposal' " +
				  "WHEN METRIC_CODE = 'BHM8' THEN 'Recommended' " +
				  "WHEN METRIC_CODE = 'PR25' THEN 'Ampf''d Sent''t'	" +	
				  "WHEN METRIC_CODE = 'BHM9' THEN 'Likelihood' " +
				  "WHEN METRIC_CODE = 'PR24' THEN 'Social Share'	" +	
				  "WHEN METRIC_CODE = 'PR1' THEN 'Mentions SOV' " +
				  "WHEN METRIC_CODE = 'INT2' THEN 'Factored Pipeline' " +
				  "WHEN METRIC_CODE = 'PR23' THEN 'Orig Sent''t' " +
				  "WHEN METRIC_CODE = 'INT3' AND TRIM(DISPLAY_NAME) = 'New Client Acquisition [IBM SDFDM]-new client acquisition' THEN 'Client Acquisition' " +
				  "WHEN METRIC_CODE = 'INT3' AND TRIM(DISPLAY_NAME) = 'New Client Acquisition [IBM SDFDM]-new to brand' THEN 'New to Brand' " +
				  "WHEN METRIC_CODE = 'INT4' THEN 'Revenue Client' " +
				  "WHEN METRIC_CODE = 'INT5' THEN 'Client Attrition' " +
				  "WHEN METRIC_CODE = 'CEM1' THEN 'CEM-R' " +
				  "WHEN METRIC_CODE = 'CEM5' THEN 'CEM-T' " +
				  "WHEN METRIC_CODE = 'INT6' THEN 'Profile' " +
				  "WHEN METRIC_CODE = 'PR6' AND COLUMN = 1 THEN 'Influencers SOV' " +
				  "WHEN METRIC_CODE = 'PR6' AND COLUMN = 2 THEN 'Mentions SOV' " +
				  "WHEN METRIC_CODE = 'PR4' THEN 'Identified' " +
				  "WHEN METRIC_CODE = 'PR5' THEN 'Reach' " +
				  "WHEN METRIC_CODE = 'PR21' THEN 'Mentions Sent''t' " +
				  "WHEN METRIC_CODE = 'PR8' THEN 'Engage' " +
				  "WHEN METRIC_CODE = 'PR19' THEN 'IBMers' " +
				  "WHEN METRIC_CODE = 'INT7' THEN 'ibm.com' " +
				  "WHEN METRIC_CODE = 'PR28' THEN 'Amplf''d SOV' " +
				  "WHEN METRIC_CODE = 'PR27' AND COLUMN = 1 THEN 'Influencers Orig' " +
				  "WHEN METRIC_CODE = 'PR27' AND COLUMN = 2 THEN 'Orig SOV' " +
				  "WHEN METRIC_CODE = 'PR12' THEN 'Inflr SOV' " +
				  "WHEN METRIC_CODE = 'PR22' THEN 'Ampf''d Sent''t' " +
				  "WHEN METRIC_CODE = 'PR21' THEN 'Influencers Sentiment' " +
				  "WHEN METRIC_CODE = 'PR16' THEN 'Orig Sent''t' " +
				  "WHEN METRIC_CODE = 'NDS1' THEN 'Consideration' " +
				  "WHEN METRIC_CODE = 'PR14' THEN 'Mentions SOV' " +
				  "WHEN METRIC_CODE = 'NDS3' THEN 'Familiarity' " +
				  "WHEN METRIC_CODE = 'NDS8' THEN 'Existing Environment' " +
				  "WHEN METRIC_CODE = 'PR31' THEN 'Mentions Sent''t' " +
				  "WHEN METRIC_CODE = 'NDS9' THEN 'APIs' " +
				  "WHEN METRIC_CODE = 'NDS10' THEN 'Used Quickly' " +
				  "WHEN METRIC_CODE = 'NDS5' THEN 'Use Platform' " +
				  "WHEN METRIC_CODE = 'PR15' THEN 'Engagement' " +
				  "WHEN METRIC_CODE = 'INT12' THEN 'Registrants' " +
				  "WHEN METRIC_CODE = 'NDS4' THEN 'Trial' " +
				  "WHEN METRIC_CODE = 'NDS2' THEN 'provider' " +
				  "WHEN METRIC_CODE = 'NDS7' THEN 'Recommended' " +
				  "WHEN METRIC_CODE = 'PR29' THEN 'Orig SOV' " +
				  "WHEN METRIC_CODE = 'PR18' THEN 'Ampf''d SOV' " +
				  "WHEN METRIC_CODE = 'NDS6' THEN 'Likelihood' " +
				  "WHEN METRIC_CODE = 'PR30' THEN 'Orig Sent''t' " +
				  "WHEN METRIC_CODE = 'PR32' THEN 'Ampf''d Sent''t' " +
				  "WHEN METRIC_CODE = 'EMP9' THEN 'Engagement' " +
				  "WHEN METRIC_CODE = 'EMP11' THEN 'Proud' " +
				  "WHEN METRIC_CODE = 'EMP1' THEN 'Great' " +
				  "WHEN METRIC_CODE = 'EMP7' THEN 'Recommend' " +
				  "WHEN METRIC_CODE = 'INT16' THEN 'Growth Gap' " +
				  "ELSE NULL " +
				  "END 	AS SHORT_NAME, " +
				  "CASE " +
				  "WHEN METRIC_CODE = 'BHM1' THEN 'Brand' " +
				  "WHEN METRIC_CODE = 'BHM10' THEN 'Category Awareness' " +
				  "WHEN METRIC_CODE = 'PR20' THEN 'Mentions Sent''t' " +
				  "WHEN METRIC_CODE = 'BHM5' THEN 'Relevance' " +
				  "WHEN METRIC_CODE = 'BHM6' THEN 'Optimize'	" +	
				  "WHEN METRIC_CODE = 'INT1' THEN 'Market Share' " +
				  "WHEN METRIC_CODE = 'BHM3' THEN 'Preference' " +
				  "WHEN METRIC_CODE = 'BHM4' THEN 'Engagement' " +
				  "WHEN METRIC_CODE = 'BHM7' THEN 'Proposal' " +
				  "WHEN METRIC_CODE = 'BHM8' THEN 'Recommended' " +
				  "WHEN METRIC_CODE = 'PR25' THEN 'Ampf''d Sent''t'	" +	
				  "WHEN METRIC_CODE = 'BHM9' THEN 'Likelihood' " +
				  "WHEN METRIC_CODE = 'PR24' THEN 'Social Share'	" +	
				  "WHEN METRIC_CODE = 'PR1' THEN 'Mentions SOV' " +
				  "WHEN METRIC_CODE = 'INT2' THEN 'Factored Pipeline' " +
				  "WHEN METRIC_CODE = 'PR23' THEN 'Orig Sent''t' " +
				  "WHEN METRIC_CODE = 'INT3' AND TRIM(DISPLAY_NAME) = 'New Client Acquisition [IBM SDFDM]-new client acquisition' THEN 'Client Acquisition' " +
				  "WHEN METRIC_CODE = 'INT3' AND TRIM(DISPLAY_NAME) = 'New Client Acquisition [IBM SDFDM]-new to brand' THEN 'New to Brand' " +
				  "WHEN METRIC_CODE = 'INT4' THEN 'Revenue Client' " +
				  "WHEN METRIC_CODE = 'INT5' THEN 'Client Attrition' " +
				  "WHEN METRIC_CODE = 'CEM1' THEN 'CEM-R' " +
				  "WHEN METRIC_CODE = 'CEM5' THEN 'CEM-T' " +
				  "WHEN METRIC_CODE = 'INT6' THEN 'Profile' " +
				  "WHEN METRIC_CODE = 'PR6' AND COLUMN = 1 THEN 'Influencers SOV' " +
				  "WHEN METRIC_CODE = 'PR6' AND COLUMN = 2 THEN 'Mentions SOV' " +
				  "WHEN METRIC_CODE = 'PR4' THEN 'Identified' " +
				  "WHEN METRIC_CODE = 'PR5' THEN 'Reach' " +
				  "WHEN METRIC_CODE = 'PR21' THEN 'Mentions Sent''t' " +
				  "WHEN METRIC_CODE = 'PR8' THEN 'Engage' " +
				  "WHEN METRIC_CODE = 'PR19' THEN 'IBMers' " +
				  "WHEN METRIC_CODE = 'INT7' THEN 'ibm.com' " +
				  "WHEN METRIC_CODE = 'PR28' THEN 'Amplf''d SOV' " +
				  "WHEN METRIC_CODE = 'PR27' AND COLUMN = 1 THEN 'Influencers Orig' " +
				  "WHEN METRIC_CODE = 'PR27' AND COLUMN = 2 THEN 'Orig SOV' " +
				  "WHEN METRIC_CODE = 'PR12' THEN 'Inflr SOV' " +
				  "WHEN METRIC_CODE = 'PR22' THEN 'Ampf''d Sent''t' " +
				  "WHEN METRIC_CODE = 'PR21' THEN 'Influencers Sentiment' " +
				  "WHEN METRIC_CODE = 'PR16' THEN 'Orig Sent''t' " +
				  "WHEN METRIC_CODE = 'NDS1' THEN 'Consideration' " +
				  "WHEN METRIC_CODE = 'PR14' THEN 'Mentions SOV' " +
				  "WHEN METRIC_CODE = 'NDS3' THEN 'Familiarity' " +
				  "WHEN METRIC_CODE = 'NDS8' THEN 'Existing Environment' " +
				  "WHEN METRIC_CODE = 'PR31' THEN 'Mentions Sent''t' " +
				  "WHEN METRIC_CODE = 'NDS9' THEN 'APIs' " +
				  "WHEN METRIC_CODE = 'NDS10' THEN 'Used Quickly' " +
				  "WHEN METRIC_CODE = 'NDS5' THEN 'Use Platform' " +
				  "WHEN METRIC_CODE = 'PR15' THEN 'Engagement' " +
				  "WHEN METRIC_CODE = 'INT12' THEN 'Registrants' " +
				  "WHEN METRIC_CODE = 'NDS4' THEN 'Trial' " +
				  "WHEN METRIC_CODE = 'NDS2' THEN 'provider' " +
				  "WHEN METRIC_CODE = 'NDS7' THEN 'Recommended' " +
				  "WHEN METRIC_CODE = 'PR29' THEN 'Orig SOV' " +
				  "WHEN METRIC_CODE = 'PR18' THEN 'Ampf''d SOV' " +
				  "WHEN METRIC_CODE = 'NDS6' THEN 'Likelihood' " +
				  "WHEN METRIC_CODE = 'PR30' THEN 'Orig Sent''t' " +
				  "WHEN METRIC_CODE = 'PR32' THEN 'Ampf''d Sent''t' " +
				  "WHEN METRIC_CODE = 'EMP9' THEN 'Engagement' " +
				  "WHEN METRIC_CODE = 'EMP11' THEN 'Proud' " +
				  "WHEN METRIC_CODE = 'EMP1' THEN 'Great' " +
				  "WHEN METRIC_CODE = 'EMP7' THEN 'Recommend' " +
				  "WHEN METRIC_CODE = 'INT16' THEN 'Growth Gap' " +
				  "ELSE NULL " +
				  "END 	AS CAMSS_SHORT_NAME, " +
				  "P.METRIC_CODE, " +  
				  "P.DISPLAY_NAME, " +  
				  "P.CAMS_DISPLAY_NAME, " +
				  "P.EMP_RATING, " +  
				  "P.YEAR, " +  
				  "P.MONTH, " +  
				  "P.QUARTER, " + 
				  "WEEK(P.START_DATE) AS WEEK, " +
				  "P.DATE_PERIOD_TYPE, " +  
				  "P.IOT_WEIGHTINGS, " +  
				  "P.WW_WEIGHTINGS, " +
				  "P.DEV_IOT_WEIGHTINGS, " +
				  "P.DEV_WW_WEIGHTINGS, " +
//Market
				  "P.COLOR_SCORE, " +
				  "P.P_COLOR_SCORE, " +
				  "P.RATING, " +
				  "P.P_RATING, " +
				  "P.TOP_COMPANY_NAME, " +
				  "P.IBM_RANKING, " +
//COGNITIVE
				  "P.COGNITIVE_COLOR_SCORE, " +
				  "P.COGNITIVE_P_COLOR_SCORE, " +
				  "P.COGNITIVE_RATING, " +
				  "P.COGNITIVE_P_RATING, " +
				  "P.COGNITIVE_TOP_COMPANY_NAME, " +
				  "P.COGNITIVE_IBM_RANKING, " +
//CLOUD
				  "P.CLOUD_COLOR_SCORE, " +
				  "P.CLOUD_P_COLOR_SCORE, " +
				  "P.CLOUD_RATING, " +
				  "P.CLOUD_P_RATING, " +
				  "P.CLOUD_TOP_COMPANY_NAME, " +
				  "P.CLOUD_IBM_RANKING, " +
//ANALYTICS
				  "P.ANALYTICS_COLOR_SCORE, " +
				  "P.ANALYTICS_P_COLOR_SCORE, " +
				  "P.ANALYTICS_RATING, " +
				  "P.ANALYTICS_P_RATING, " +
				  "P.ANALYTICS_TOP_COMPANY_NAME, " +
				  "P.ANALYTICS_IBM_RANKING, " +
//MOBILE
				  "P.MOBILE_COLOR_SCORE, " +
				  "P.MOBILE_P_COLOR_SCORE, " +
				  "P.MOBILE_RATING, " +
				  "P.MOBILE_P_RATING, " +
				  "P.MOBILE_TOP_COMPANY_NAME, " +
				  "P.MOBILE_IBM_RANKING, " +
//SOCIAL
				  "P.SOCIAL_COLOR_SCORE, " +
				  "P.SOCIAL_P_COLOR_SCORE, " +
				  "P.SOCIAL_RATING, " +
				  "P.SOCIAL_P_RATING, " +
				  "P.SOCIAL_TOP_COMPANY_NAME, " +
				  "P.SOCIAL_IBM_RANKING, " +
//SECURITY
				  "P.SECURITY_COLOR_SCORE, " +
				  "P.SECURITY_P_COLOR_SCORE, " +
				  "P.SECURITY_RATING, " +
				  "P.SECURITY_P_RATING, " +
				  "P.SECURITY_TOP_COMPANY_NAME, " +
				  "P.SECURITY_IBM_RANKING, " +
//INT16 WWIOT
				  "P.IOT_RATING, " +
				  "P.WW_IOT_RATING, " +
				  "P.IOT_P_RATING, " +
				  "P.WW_IOT_P_RATING " +
			"FROM  V_BHMS_DASHBOARD_REPORTING_IOT_LISTS_DATA P, " +
			      "( " +
				      "SELECT " +
				          "MAX(TO_NUMBER(TRIM(YEAR)||LPAD(TRIM(LTRIM(MONTH,0)), 2, '0'))) AS MAX_DATE, " +
				          "COUNTRY_NAME                                                   AS COUNTRY_NAME_T, " +
				          "CONSTITUENTS                                                   AS CONSTITUENTS_T, " +
				          "COLUMN                                                         AS COLUMN_T, " +
				          "SEQUENCE                                                       AS SEQUENCE_T " +
				      "FROM " +
				          "V_BHMS_DASHBOARD_REPORTING_IOT_LISTS_DATA " +
				      "WHERE " +
				          "TO_NUMBER(TRIM(YEAR)||LPAD(TRIM(LTRIM(MONTH,0)), 2, '0')) <= TO_NUMBER(?||LPAD(?, 2, '0')) " +
				      "AND IOT_NAME IS NOT NULL " +
				      "GROUP BY COUNTRY_NAME, CONSTITUENTS, COLUMN, SEQUENCE " +
			      ") TMP " +
	      "WHERE TO_NUMBER(TRIM(YEAR)||LPAD(TRIM(LTRIM(MONTH,0)), 2, '0')) = TMP.MAX_DATE " +
			"AND TMP.COUNTRY_NAME_T = P.COUNTRY_NAME " +
			"AND TMP.CONSTITUENTS_T = P.CONSTITUENTS " +
			"AND TMP.COLUMN_T = P.COLUMN " +
			"AND TMP.SEQUENCE_T = P.SEQUENCE " +
//			"AND IOT_NAME <> 'XX' AND COUNTRY_NAME <> 'Indonesia' " +
			"AND METRIC_CODE <> 'PR12' " +
			"AND IOT_NAME <> 'XX' " +
	   "ORDER BY P.IOT_NAME, P.COUNTRY_NAME, CONSTITUENTS_ORDER, P.COLUMN, P.SEQUENCE "
);

function getWWIotDashboardListsReport(param) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : getWWIotDashboardListsReportStatement,
		parameters : param
	});
}

function getWWIotDashboardListsReportByMonth(param) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : getWWIotDashboardListsReportByMonthStatement,
		parameters : param
	});
}

var dashboardListsReportStatement   = WL.Server.createSQLStatement(
		"SELECT " +
			"DISTINCT CONSTITUENTS, " +
			"COLUMN,  " +
			"SEQUENCE, " +
			"DISPLAY_VALUE , " +
			"METRIC_CODE,  " +
			"COMPANY,  " +
			"COLOR_CODE,  " +
			"DISPLAY_NAME,  " +
			"ICON_TEXT  " +
		"FROM BHMS.V_BHMS_DASHBOARD_RANKED_LISTS_DATA " +
		"WHERE COUNTRY_NAME=? AND IBMER = '' " +
		"AND CURRENT = 'Y' " +
		"AND CONSTITUENTS <> 'INFLUENCERS-PR12' " +
		"AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y' AND USER_PROFILE = ?) " +
		"ORDER BY CONSTITUENTS, COLUMN, SEQUENCE"
);

var dashboardListsReportByMonthStatement   = WL.Server.createSQLStatement(
	  "SELECT " +
			"DISTINCT CONSTITUENTS, " +
			"COLUMN,  " +
			"SEQUENCE, " +
			"DISPLAY_VALUE , " +
			"METRIC_CODE,  " +
			"COMPANY,  " +
			"COLOR_CODE,  " +
			"DISPLAY_NAME,  " +
			"ICON_TEXT  " +
		"FROM BHMS.V_BHMS_DASHBOARD_RANKED_LISTS_DATA  , (SELECT " +
		"DISTINCT MAX(TO_NUMBER(TRIM(YEAR)||LPAD(TRIM(LTRIM(MONTH,0)), 2, '0'))) AS MAX_DATE, " +
		"COLUMN AS COLUMN_T, CONSTITUENTS AS CONSTITUENTS_T, SEQUENCE AS SEQUENCE_T  " +
		"FROM BHMS.V_BHMS_DASHBOARD_RANKED_LISTS_DATA  " +
		"WHERE COUNTRY_NAME = ? " +
		"AND CONSTITUENTS <> 'INFLUENCERS-PR12' " +
		"AND TO_NUMBER(TRIM(YEAR)||LPAD(TRIM(LTRIM(MONTH,0)), 2, '0')) <= TO_NUMBER(?||LPAD(?, 2, '0'))  " +
		"GROUP BY CONSTITUENTS, COLUMN, SEQUENCE) TMP  " +
		"WHERE COUNTRY_NAME = ? AND IBMER = '' " +
		"AND TO_NUMBER(TRIM(YEAR)||LPAD(TRIM(LTRIM(MONTH,0)), 2, '0'))= TMP.MAX_DATE " +
		"AND COLUMN = TMP.COLUMN_T " +
		"AND CONSTITUENTS = TMP.CONSTITUENTS_T " +
		"AND SEQUENCE = TMP.SEQUENCE_T " + 
		"AND CONSTITUENTS <> 'INFLUENCERS-PR12' " +
        "AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y' AND USER_PROFILE = ?) " +
		"ORDER BY CONSTITUENTS, COLUMN, SEQUENCE"
);

function getDashboardListsReport(param) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : dashboardListsReportStatement,
		parameters : param
	});
}

function getDashboardListsReportByMonth(country, year, month, profile) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : dashboardListsReportByMonthStatement,
		parameters : [country, year, month, country, profile]
	});
}

var dashboardBarChartDataStatement = WL.Server.createSQLStatement(
		"SELECT " +
			"DISTINCT CONSTITUENTS, " +
			"COLUMN, " +
			"SEQUENCE, " +
			"METRIC_CODE, " +
			"COMPANY, " +
			"RANKING, " +
			"VALUE, " +
			"MEASURE, " +
			"NUMERIC_FORMAT " +
		"FROM BHMS.V_BHMS_DASHBOARD_RANKED_BAR_CHARTS_DATA " +
			"WHERE COUNTRY_NAME=? AND CURRENT='Y' AND IBMER = '' " +
			"AND CONSTITUENTS <> 'INFLUENCERS-PR12' " +
			"AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y' AND USER_PROFILE = ?) " +
			"ORDER BY CONSTITUENTS, COLUMN, SEQUENCE");

var dashboardBarChartDataStatementByMonth = WL.Server.createSQLStatement(
		"SELECT " +
			"DISTINCT CONSTITUENTS, " +
			"COLUMN, " +
			"SEQUENCE, " +
			"METRIC_CODE, " +
			"COMPANY, " +
			"RANKING, " +
			"VALUE, " +
			"MEASURE, " +
			"NUMERIC_FORMAT " +
			"FROM BHMS.V_BHMS_DASHBOARD_RANKED_BAR_CHARTS_DATA , " +
			"(SELECT DISTINCT MAX(TO_NUMBER(TRIM(YEAR)||LPAD(TRIM(LTRIM(MONTH,'0')), 2, '0'))) AS MAX_DATE, COLUMN AS COLUMN_T , CONSTITUENTS AS CONSTITUENTS_T, SEQUENCE AS SEQUENCE_T  " +
			"FROM BHMS.V_BHMS_DASHBOARD_RANKED_BAR_CHARTS_DATA " +
			"WHERE COUNTRY_NAME = ? " +
			"AND CONSTITUENTS <> 'INFLUENCERS-PR12' " +
			"AND TO_NUMBER(TRIM(YEAR)||LPAD(TRIM(LTRIM(MONTH,'0')), 2, '0')) <= TO_NUMBER(?||LPAD(?, 2, '0')) " +
			"GROUP BY CONSTITUENTS, COLUMN, SEQUENCE) TMP " +
			"WHERE TO_NUMBER(TRIM(YEAR)||LPAD(TRIM(LTRIM(MONTH,'0')), 2, '0')) = TMP.MAX_DATE " +
			"AND COLUMN = TMP.COLUMN_T " +
			"AND CONSTITUENTS = TMP.CONSTITUENTS_T " +
			"AND SEQUENCE = TMP.SEQUENCE_T " +
			"AND COUNTRY_NAME=? AND IBMER = '' " +
			"AND CONSTITUENTS <> 'INFLUENCERS-PR12' " +
			"AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y' AND USER_PROFILE = ?) " +
			"ORDER BY CONSTITUENTS, COLUMN, SEQUENCE");
			
function getDashboardBarChartData(param) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : dashboardBarChartDataStatement,
		parameters : param
	});
}

function getDashboardBarChartDataByMonth(country, year, month, profile) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : dashboardBarChartDataStatementByMonth,
		parameters : [country, year, month, country, profile]
	});
}

var influencerDashboardStatement = WL.Server.createSQLStatement(
	"SELECT " +
		"DISTINCT COLUMN, " +
		"SEQUENCE, " +
		"DISPLAY_VALUE, " +
		"METRIC_CODE, " +
		"COMPANY, " +
		"COLOR_CODE,   " +
		"DISPLAY_NAME,   " +
		"ICON_TEXT, " +
		"ANALYTICS, ANALYTICS_RATING, ANALYTICS_COLOR, ANALYTICS_RANKING, " +
		"COGNITIVE, COGNITIVE_RATING, COGNITIVE_COLOR, COGNITIVE_RANKING, " +
		"CLOUD, CLOUD_RATING, CLOUD_COLOR, CLOUD_RANKING, " +
		"MOBILE, MOBILE_RATING, MOBILE_COLOR, MOBILE_RANKING, " +
		"SOCIAL, SOCIAL_RATING, SOCIAL_COLOR, SOCIAL_RANKING, " +
		"SECURITY, SECURITY_RATING, SECURITY_COLOR, SECURITY_RANKING, IBMER " +
  "FROM BHMS.V_BHMS_DASHBOARD_RANKED_LISTS_DATA " +
 "WHERE COUNTRY_NAME = ? AND CONSTITUENTS = 'INFLUENCERS' AND CURRENT='Y' and metric_code in (select distinct metric_code from bhms_profile_metric_security where active = 'Y' and user_profile = ?) " +
 "ORDER BY COLUMN, SEQUENCE, IBMER");

var influencerDashboardByMonthStatement = WL.Server.createSQLStatement(
		"SELECT " +
			"DISTINCT COLUMN, " +
			"SEQUENCE, " +
			"DISPLAY_VALUE, " +
			"METRIC_CODE, " +
			"COMPANY, " +
			"COLOR_CODE,   " +
			"DISPLAY_NAME,   " +
			"ICON_TEXT, " +
			"ANALYTICS, ANALYTICS_RATING, ANALYTICS_COLOR, ANALYTICS_RANKING, " +
			"COGNITIVE, COGNITIVE_RATING, COGNITIVE_COLOR, COGNITIVE_RANKING, " +
			"CLOUD, CLOUD_RATING, CLOUD_COLOR, CLOUD_RANKING, " +
			"MOBILE, MOBILE_RATING, MOBILE_COLOR, MOBILE_RANKING, " +
			"SOCIAL, SOCIAL_RATING, SOCIAL_COLOR, SOCIAL_RANKING, " +
			"SECURITY, SECURITY_RATING, SECURITY_COLOR, SECURITY_RANKING, IBMER " +
		"FROM BHMS.V_BHMS_DASHBOARD_RANKED_LISTS_DATA , (SELECT DISTINCT MAX(TO_NUMBER(TRIM(YEAR)||LPAD(TRIM(LTRIM(MONTH,'0')), 2, '0'))) AS MAX_DATE, COLUMN AS COLUMN_T, SEQUENCE AS SEQUENCE_T " +
		"FROM BHMS.V_BHMS_DASHBOARD_RANKED_LISTS_DATA " +
			"WHERE COUNTRY_NAME = ? " +
			"AND CONSTITUENTS = 'INFLUENCERS' " +
			"AND TO_NUMBER(TRIM(YEAR)||LPAD(TRIM(LTRIM(MONTH,'0')), 2, '0')) <= TO_NUMBER(?||LPAD(?, 2, '0')) " + 
			"GROUP BY COLUMN, SEQUENCE) TMP " + 
		"WHERE TO_NUMBER(TRIM(YEAR)||LPAD(TRIM(LTRIM(MONTH,'0')), 2, '0')) = TMP.MAX_DATE " +
			"AND COLUMN = TMP.COLUMN_T " +
			"AND SEQUENCE = TMP.SEQUENCE_T " +
			"AND COUNTRY_NAME = ? AND CONSTITUENTS = 'INFLUENCERS' " +
			"AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y' AND USER_PROFILE = ?) " +
			"ORDER BY COLUMN, SEQUENCE, IBMER");

function getInfluencerDashboard(param) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : influencerDashboardStatement,
		parameters : param
	});
}

function getInfluencerDashboardByMonth(country, year, month, profile) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : influencerDashboardByMonthStatement,
		parameters : [country, year, month, country, profile]
	});
}

var influencerBarChartDataStatement = WL.Server.createSQLStatement(
	"SELECT " +
		"DISTINCT COLUMN, " +
		"SEQUENCE, " +
		"METRIC_CODE, " +
		"COMPANY, " +
		"RANKING, " +
		"VALUE, " +
		"MEASURE, " +
		"ANALYTICS, " +
		"COGNITIVE, " +
		"CLOUD,  " +
		"MOBILE,  " +
		"SOCIAL,  " +
		"SECURITY, " +
		"NUMERIC_FORMAT, IBMER " +
  "FROM BHMS.V_BHMS_DASHBOARD_RANKED_BAR_CHARTS_DATA " +
 "WHERE COUNTRY_NAME=? AND CONSTITUENTS = 'INFLUENCERS' AND CURRENT='Y' and metric_code in (select distinct metric_code from bhms_profile_metric_security where active = 'Y' and user_profile = ?) " + 
 "ORDER BY COLUMN, SEQUENCE, COMPANY, IBMER");

var influencerBarChartDataByMonthStatement = WL.Server.createSQLStatement(
		"SELECT " +
			"DISTINCT COLUMN, " +
			"SEQUENCE, " +
			"METRIC_CODE, " +
			"COMPANY, " +
			"RANKING, " +
			"VALUE, " +
			"MEASURE, " +
			"ANALYTICS, " +
			"COGNITIVE, " +
			"CLOUD,  " +
			"MOBILE,  " +
			"SOCIAL,  " +
			"SECURITY, " +
			"NUMERIC_FORMAT, IBMER " +
		"FROM BHMS.V_BHMS_DASHBOARD_RANKED_BAR_CHARTS_DATA , (SELECT DISTINCT MAX(TO_NUMBER(TRIM(YEAR)||LPAD(TRIM(LTRIM(MONTH,'0')), 2, '0'))) AS MAX_DATE, COLUMN AS COLUMN_T, SEQUENCE AS SEQUENCE_T " +
		"FROM BHMS.V_BHMS_DASHBOARD_RANKED_BAR_CHARTS_DATA " +
		"WHERE COUNTRY_NAME = ? " +
		"AND CONSTITUENTS = 'INFLUENCERS' " + 
		"AND TO_NUMBER(TRIM(YEAR)||LPAD(TRIM(LTRIM(MONTH,'0')), 2, '0')) <= TO_NUMBER(?||LPAD(?, 2, '0')) " + 
		"GROUP BY COLUMN, SEQUENCE) TMP " + 
			"WHERE TO_NUMBER(TRIM(YEAR)||LPAD(TRIM(LTRIM(MONTH,'0')), 2, '0')) = TMP.MAX_DATE " +
			"AND COLUMN = TMP.COLUMN_T " +
			"AND SEQUENCE = TMP.SEQUENCE_T " +
			"AND COUNTRY_NAME=? AND CONSTITUENTS = 'INFLUENCERS' " + 
			"AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y' AND USER_PROFILE = ?) " +
			"ORDER BY COLUMN, SEQUENCE, COMPANY, IBMER");

function getInfluencerBarChartData(param) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : influencerBarChartDataStatement,
		parameters : param
	});
}

function getInfluencerBarChartDataByMonth(country, year, month, profile) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : influencerBarChartDataByMonthStatement,
		parameters : [country, year, month, country, profile]
	});
}

var influencerChartData = "SELECT current.COLUMN, current.PAGE_CHART_TYPE, current.DISPLAY_NAME, current.SEQUENCE, current.METRIC_CODE, current.COMPANY,  "+
		"current.SAMPLE_SIZE_MESSAGE, current.SAMPLE_SIZE_ANALYTICS, current.SAMPLE_SIZE_COGNITIVE, current.SAMPLE_SIZE_CLOUD, current.SAMPLE_SIZE_MOBILE, " + 
		"current.SAMPLE_SIZE_SOCIAL, current.SAMPLE_SIZE_SECURITY, current.RANKING, current.RATING, current.TYPE, current.VALUE, current.OVERALL_SUM, "+
		"current.ANALYTICS_SUM, current.ANALYTICS_RATING, current.ANALYTICS_RANKING, "+
		"current.COGNITIVE_SUM, current.COGNITIVE_RATING, current.COGNITIVE_RANKING, " +
		"current.CLOUD_SUM, current.CLOUD_RATING, current.CLOUD_RANKING, " +
		"current.MOBILE_SUM, current.MOBILE_RATING, current.MOBILE_RANKING, " +
		"current.SOCIAL_SUM, current.SOCIAL_RATING, current.SOCIAL_RANKING, " +
		"current.SECURITY_SUM, current.SECURITY_RATING, current.SECURITY_RANKING, " +
		"current.DATA_PERIOD_TYPE, current.RANKING_DISPLAY, current.NUMERIC_FORMAT, " +
		"previous.RATING as P_RATING, previous.ANALYTICS_RATING as P_ANALYTICS_RATING, previous.COGNITIVE_RATING as P_COGNITIVE_RATING, previous.CLOUD_RATING as P_CLOUD_RATING, " +
		"previous.MOBILE_RATING as P_MOBILE_RATING, previous.SOCIAL_RATING as P_SOCIAL_RATING, previous.SECURITY_RATING as P_SECURITY_RATING, " + 
		"previous.RANKING as P_RANKING, previous.ANALYTICS_RANKING as P_ANALYTICS_RANKING, previous.COGNITIVE_RANKING as P_COGNITIVE_RANKING, previous.CLOUD_RANKING as P_CLOUD_RANKING, " +
		"previous.MOBILE_RANKING as P_MOBILE_RANKING, previous.SOCIAL_RANKING as P_SOCIAL_RANKING, previous.SECURITY_RANKING as P_SECURITY_RANKING, " + 
		"current.YEAR, current.MONTH, current.QUARTER, current.PIE_LABEL, CURRENT.ICON_TEXT, " +  addDetailUrlField +
		"from "+
		"(select DISTINCT COLUMN, PAGE_CHART_TYPE, DISPLAY_NAME, SEQUENCE, METRIC_CODE, COMPANY,   "+
		"	SAMPLE_SIZE_MESSAGE, SAMPLE_SIZE_ANALYTICS, SAMPLE_SIZE_COGNITIVE, SAMPLE_SIZE_CLOUD, SAMPLE_SIZE_MOBILE,   "+
		"	SAMPLE_SIZE_SOCIAL, SAMPLE_SIZE_SECURITY, RANKING, RATING, TYPE, VALUE, OVERALL_SUM, " +
		"   ANALYTICS_SUM, ANALYTICS_RATING, ANALYTICS_RANKING, " +
		"   COGNITIVE_SUM, COGNITIVE_RATING, COGNITIVE_RANKING, " +
		"   CLOUD_SUM, CLOUD_RATING, CLOUD_RANKING, " +
		"   MOBILE_SUM, MOBILE_RATING, MOBILE_RANKING, " +
		"   SOCIAL_SUM, SOCIAL_RATING, SOCIAL_RANKING, " +
		"   SECURITY_SUM, SECURITY_RATING, SECURITY_RANKING, " +
		"   DATA_PERIOD_TYPE, RANKING_DISPLAY, NUMERIC_FORMAT, " +
		"   YEAR, MONTH, QUARTER, PIE_LABEL, ICON_TEXT, " +  addDetailUrlField +
		"	from BHMS.V_BHMS_INFLUENCER_CHART_DATA     "+
		"	WHERE  CURRENT = 'Y'     "+
		"	AND COUNTRY_NAME = p_country     "+
		"	AND COLUMN = p_column   " +
		"	AND METRIC_CODE <> 'PR12' "+
		"	AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y'   "+
		"	AND USER_PROFILE = p_profile) "+
		") current "+
		"left join( "+
		"select MAX(CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE)) AS MAX_DATE,  "+
		"second.SEQUENCE AS SEQUENCE_T, second.METRIC_CODE as METRIC_CODE_T   "+
		"from BHMS.V_BHMS_INFLUENCER_CHART_DATA first "+
		"join BHMS.V_BHMS_INFLUENCER_CHART_DATA second "+
		"on first.SEQUENCE = second.SEQUENCE "+
		"and first.METRIC_CODE = second.METRIC_CODE "+
		"and first.COUNTRY_NAME = second.COUNTRY_NAME "+
		"and first.COLUMN = second.COLUMN "+
		"and first.COUNTRY_NAME = p_country "+
		"and first.COLUMN = p_column "+
		"and first.METRIC_CODE <> 'PR12' "+
		"and second.CURRENT = 'Y'  " +
		"and CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE) <=  "+
		" 	 case when second.DATA_PERIOD_TYPE = 'MONTHLY' then       "+
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 MONTH       "+
		" 	 when second.DATA_PERIOD_TYPE = 'QUARTERLY' then       "+
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 3 MONTHS       "+
		" 	 when second.DATA_PERIOD_TYPE = 'ANNUAL' then       "+
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 YEAR       "+
		" 	 when second.DATA_PERIOD_TYPE = 'SEMI_ANNUAL' then       "+
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 6 MONTHS       "+
		" 	 when second.DATA_PERIOD_TYPE = 'WEEKLY' then       "+
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 7 DAYS       "+
		" 	 else CAST('1900-1-1' AS DATE) end  "+
		"group by second.SEQUENCE, second.METRIC_CODE "+
		") join_table "+
		"on current.SEQUENCE = join_table.SEQUENCE_T  "+
		"and current.METRIC_CODE = join_table.METRIC_CODE_T  "+
		"left join "+
		"(select distinct SEQUENCE,METRIC_CODE,YEAR,MONTH,RATING, ANALYTICS_RATING, COGNITIVE_RATING, CLOUD_RATING, MOBILE_RATING,SOCIAL_RATING,SECURITY_RATING, "+
		"   RANKING, ANALYTICS_RANKING, COGNITIVE_RANKING, CLOUD_RANKING, MOBILE_RANKING, SOCIAL_RANKING, SECURITY_RANKING, COMPANY, TYPE " +
		"	from BHMS.V_BHMS_INFLUENCER_CHART_DATA  "+
		"	where COUNTRY_NAME = p_country AND COLUMN = p_column AND METRIC_CODE <> 'PR12' "+
		") previous  "+
		"on join_table.SEQUENCE_T = previous.SEQUENCE   "+
		"and join_table.METRIC_CODE_T = previous.METRIC_CODE  "+
		"and previous.COMPANY = current.COMPANY "+
		"and previous.TYPE = current.TYPE "+
		"and CAST(trim(previous.YEAR)||'-'||trim(previous.MONTH)||'-01' AS DATE) = join_table.MAX_DATE   "+
		"ORDER BY COLUMN, SEQUENCE, RANKING ";

var influencerChartDataByMonth = "SELECT current.COLUMN, current.PAGE_CHART_TYPE, current.DISPLAY_NAME, current.SEQUENCE, current.METRIC_CODE, current.COMPANY,  "+
		"current.SAMPLE_SIZE_MESSAGE, current.SAMPLE_SIZE_ANALYTICS, current.SAMPLE_SIZE_COGNITIVE, current.SAMPLE_SIZE_CLOUD, current.SAMPLE_SIZE_MOBILE, " + 
		"current.SAMPLE_SIZE_SOCIAL, current.SAMPLE_SIZE_SECURITY, current.RANKING, current.RATING, current.TYPE, current.VALUE, current.OVERALL_SUM, "+
		"current.ANALYTICS_SUM, current.ANALYTICS_RATING, current.ANALYTICS_RANKING, "+
		"current.COGNITIVE_SUM, current.COGNITIVE_RATING, current.COGNITIVE_RANKING, " +
		"current.CLOUD_SUM, current.CLOUD_RATING, current.CLOUD_RANKING, " +
		"current.MOBILE_SUM, current.MOBILE_RATING, current.MOBILE_RANKING, " +
		"current.SOCIAL_SUM, current.SOCIAL_RATING, current.SOCIAL_RANKING, " +
		"current.SECURITY_SUM, current.SECURITY_RATING, current.SECURITY_RANKING, " +
		"current.DATA_PERIOD_TYPE, current.RANKING_DISPLAY, current.NUMERIC_FORMAT, " +
		"previous.RATING as P_RATING, previous.ANALYTICS_RATING as P_ANALYTICS_RATING, previous.COGNITIVE_RATING as P_COGNITIVE_RATING, previous.CLOUD_RATING as P_CLOUD_RATING, " +
		"previous.MOBILE_RATING as P_MOBILE_RATING, previous.SOCIAL_RATING as P_SOCIAL_RATING, previous.SECURITY_RATING as P_SECURITY_RATING, " + 
		"previous.RANKING as P_RANKING, previous.ANALYTICS_RANKING as P_ANALYTICS_RANKING, previous.COGNITIVE_RANKING as P_COGNITIVE_RANKING, previous.CLOUD_RANKING as P_CLOUD_RANKING, " +
		"previous.MOBILE_RANKING as P_MOBILE_RANKING, previous.SOCIAL_RANKING as P_SOCIAL_RANKING, previous.SECURITY_RANKING as P_SECURITY_RANKING, " + 
		"current.YEAR, current.MONTH, current.QUARTER, current.PIE_LABEL, CURRENT.ICON_TEXT, " +  addDetailUrlField +
		"from      "+
		"(select DISTINCT COLUMN, PAGE_CHART_TYPE, DISPLAY_NAME, SEQUENCE, METRIC_CODE, COMPANY,   "+
		"	SAMPLE_SIZE_MESSAGE, SAMPLE_SIZE_ANALYTICS, SAMPLE_SIZE_COGNITIVE, SAMPLE_SIZE_CLOUD, SAMPLE_SIZE_MOBILE,   "+
		"	SAMPLE_SIZE_SOCIAL, SAMPLE_SIZE_SECURITY, RANKING, RATING, TYPE, VALUE, OVERALL_SUM, " +
		"   ANALYTICS_SUM, ANALYTICS_RATING, ANALYTICS_RANKING, " +
		"   COGNITIVE_SUM, COGNITIVE_RATING, COGNITIVE_RANKING, " +
		"   CLOUD_SUM, CLOUD_RATING, CLOUD_RANKING, " +
		"   MOBILE_SUM, MOBILE_RATING, MOBILE_RANKING, " +
		"   SOCIAL_SUM, SOCIAL_RATING, SOCIAL_RANKING, " +
		"   SECURITY_SUM, SECURITY_RATING, SECURITY_RANKING, " +
		"   DATA_PERIOD_TYPE, RANKING_DISPLAY, NUMERIC_FORMAT, " +
		"   YEAR, MONTH, QUARTER, PIE_LABEL, ICON_TEXT, " +  addDetailUrlField +
		"	from BHMS.V_BHMS_INFLUENCER_CHART_DATA     "+
		"   join "+
		"   (SELECT DISTINCT MAX(CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE)) AS MAX_DATE,     "+
		"	   SEQUENCE as SEQUENCE_T,  METRIC_CODE as METRIC_CODE_T "+
		"	   FROM BHMS.V_BHMS_INFLUENCER_CHART_DATA     "+
		"	   WHERE COUNTRY_NAME = p_country    "+
		"	   AND COLUMN = p_column   " +
		"	   AND METRIC_CODE <> 'PR12' "+
		"	   AND CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE) <= CAST(p_year||'-'||p_month||'-01' AS DATE)    "+
		"	   GROUP BY SEQUENCE, METRIC_CODE    "+
		"    ) TMP   "+
		"    on CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE) = TMP.MAX_DATE "+
		"    and SEQUENCE = TMP.SEQUENCE_T "+
		"    and METRIC_CODE = TMP.METRIC_CODE_T "+
		"	AND COUNTRY_NAME = p_country       "+
		"	AND COLUMN = p_column     " +
		"	AND METRIC_CODE <> 'PR12' "+
		"	AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y'   "+
		"	AND USER_PROFILE = p_profile) "+
		") current  "+
		"left join "+
		"(select MAX(CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE)) AS MAX_DATE,  "+
		"second.SEQUENCE AS SEQUENCE_T, second.METRIC_CODE as METRIC_CODE_T   "+
		"from BHMS.V_BHMS_INFLUENCER_CHART_DATA first "+
		"join BHMS.V_BHMS_INFLUENCER_CHART_DATA second "+
		"on first.SEQUENCE = second.SEQUENCE "+
		"and first.METRIC_CODE = second.METRIC_CODE "+
		"and first.COUNTRY_NAME = second.COUNTRY_NAME "+
		"and first.COLUMN = second.COLUMN "+
		"and first.COUNTRY_NAME = p_country "+
		"and first.COLUMN = p_column "+
		"and first.METRIC_CODE <> 'PR12' "+
		"join "+
		"(SELECT DISTINCT MAX(CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE)) AS MAX_DATE,     "+
		"	 SEQUENCE,  METRIC_CODE "+
		"	 FROM BHMS.V_BHMS_INFLUENCER_CHART_DATA     "+
		"	 WHERE COUNTRY_NAME = p_country    "+
		"	 AND COLUMN = p_column   " +
		"	 AND METRIC_CODE <> 'PR12' "+
		"	 AND CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE) <= CAST(p_year||'-'||p_month||'-01' AS DATE)    "+
		"	 GROUP BY SEQUENCE, METRIC_CODE    "+
		") TMP   "+
		"on CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE) = TMP.MAX_DATE  "+
		"and second.SEQUENCE = TMP.SEQUENCE "+
		"and second.METRIC_CODE = TMP.METRIC_CODE "+
		"and CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE) <=  "+
		"	 case when second.DATA_PERIOD_TYPE = 'MONTHLY' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 MONTH    "+
		"	 when second.DATA_PERIOD_TYPE = 'QUARTERLY' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 3 MONTHS    "+
		"	 when second.DATA_PERIOD_TYPE = 'ANNUAL' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 YEAR    "+
		"	 when second.DATA_PERIOD_TYPE = 'SEMI_ANNUAL' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 6 MONTHS    "+
		"	 when second.DATA_PERIOD_TYPE = 'WEEKLY' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 7 DAYS    "+
		"	 else CAST('1900-1-1' AS DATE) end "+
		"group by second.SEQUENCE, second.METRIC_CODE "+
		") join_table "+
		"on current.SEQUENCE = join_table.SEQUENCE_T "+
		"and current.METRIC_CODE = join_table.METRIC_CODE_T "+
		"left join "+
		"(select distinct SEQUENCE,METRIC_CODE,YEAR,MONTH,RATING, ANALYTICS_RATING, COGNITIVE_RATING, CLOUD_RATING, MOBILE_RATING, SOCIAL_RATING, SECURITY_RATING, "+
		"   RANKING, ANALYTICS_RANKING, COGNITIVE_RANKING, CLOUD_RANKING, MOBILE_RANKING, SOCIAL_RANKING, SECURITY_RANKING, COMPANY, TYPE " +
		"	from BHMS.V_BHMS_INFLUENCER_CHART_DATA  "+
		"	where COUNTRY_NAME = p_country AND COLUMN = p_column AND METRIC_CODE <> 'PR12' "+
		") previous  "+
		"on join_table.SEQUENCE_T = previous.SEQUENCE   "+
		"and join_table.METRIC_CODE_T = previous.METRIC_CODE  "+
		"and previous.COMPANY = current.COMPANY "+
		"and previous.TYPE = current.TYPE "+
		"and CAST(trim(previous.YEAR)||'-'||trim(previous.MONTH)||'-01' AS DATE) = join_table.MAX_DATE   "+
		"ORDER BY COLUMN, SEQUENCE, RANKING ";

function getInfluencerChartData(country, column, profile) {
	var influencerChartDataSql = influencerChartData.replace(/p_country/g, quoteWrap(country));
	influencerChartDataSql = influencerChartDataSql.replace(/p_column/g, column);
	influencerChartDataSql = influencerChartDataSql.replace(/p_profile/g, quoteWrap(profile));
	var mapping = [ "COLUMN",  "PAGE_CHART_TYPE",  "DISPLAY_NAME",  "SEQUENCE",  "METRIC_CODE",  "COMPANY",    
	      		  "SAMPLE_SIZE_MESSAGE",  "SAMPLE_SIZE_ANALYTICS",  "SAMPLE_SIZE_COGNITIVE", "SAMPLE_SIZE_CLOUD",  "SAMPLE_SIZE_MOBILE",     
	    		  "SAMPLE_SIZE_SOCIAL",  "SAMPLE_SIZE_SECURITY",  "RANKING",  "RATING",  "TYPE",  "VALUE",  "OVERALL_SUM",   
	    		  "ANALYTICS_SUM",  "ANALYTICS_RATING",  "ANALYTICS_RANKING",   
	    		  "COGNITIVE_SUM",  "COGNITIVE_RATING",  "COGNITIVE_RANKING",    
	    		  "CLOUD_SUM",  "CLOUD_RATING",  "CLOUD_RANKING",    
	    		  "MOBILE_SUM",  "MOBILE_RATING",  "MOBILE_RANKING",    
	    		  "SOCIAL_SUM",  "SOCIAL_RATING",  "SOCIAL_RANKING",    
	    		  "SECURITY_SUM",  "SECURITY_RATING",  "SECURITY_RANKING",    
	    		  "DATA_PERIOD_TYPE",  "RANKING_DISPLAY",  "NUMERIC_FORMAT",    
	    		 "P_RATING", "P_ANALYTICS_RATING", "P_COGNITIVE_RATING", "P_CLOUD_RATING",    
	    		 "P_MOBILE_RATING", "P_SOCIAL_RATING", "P_SECURITY_RATING",     
	    		 "P_RANKING", "P_ANALYTICS_RANKING", "P_COGNITIVE_RANKING", "P_CLOUD_RANKING",    
	    		 "P_MOBILE_RANKING", "P_SOCIAL_RANKING", "P_SECURITY_RANKING",     
	    		  "YEAR",  "MONTH",  "QUARTER",  "PIE_LABEL", "ICON_TEXT", "URL", "USER", "PW", "URL_TYPE"];
	return executeSql(influencerChartDataSql, mapping);
}

function getInfluencerChartDataByMonth(country, column, year, month, profile) {
	var influencerChartDataByMonthSql = influencerChartDataByMonth.replace(/p_country/g, quoteWrap(country));
	influencerChartDataByMonthSql = influencerChartDataByMonthSql.replace(/p_column/g, column);
	influencerChartDataByMonthSql = influencerChartDataByMonthSql.replace(/p_year/g, quoteWrap(year));
	influencerChartDataByMonthSql = influencerChartDataByMonthSql.replace(/p_month/g, quoteWrap(month));
	influencerChartDataByMonthSql = influencerChartDataByMonthSql.replace(/p_profile/g, quoteWrap(profile));
	var mapping = [ "COLUMN",  "PAGE_CHART_TYPE",  "DISPLAY_NAME",  "SEQUENCE",  "METRIC_CODE",  "COMPANY",    
		      		  "SAMPLE_SIZE_MESSAGE",  "SAMPLE_SIZE_ANALYTICS",  "SAMPLE_SIZE_COGNITIVE", "SAMPLE_SIZE_CLOUD",  "SAMPLE_SIZE_MOBILE",     
		    		  "SAMPLE_SIZE_SOCIAL",  "SAMPLE_SIZE_SECURITY",  "RANKING",  "RATING",  "TYPE",  "VALUE",  "OVERALL_SUM",   
		    		  "ANALYTICS_SUM",  "ANALYTICS_RATING",  "ANALYTICS_RANKING",   
		    		  "COGNITIVE_SUM",  "COGNITIVE_RATING",  "COGNITIVE_RANKING",    
		    		  "CLOUD_SUM",  "CLOUD_RATING",  "CLOUD_RANKING",    
		    		  "MOBILE_SUM",  "MOBILE_RATING",  "MOBILE_RANKING",    
		    		  "SOCIAL_SUM",  "SOCIAL_RATING",  "SOCIAL_RANKING",    
		    		  "SECURITY_SUM",  "SECURITY_RATING",  "SECURITY_RANKING",    
		    		  "DATA_PERIOD_TYPE",  "RANKING_DISPLAY",  "NUMERIC_FORMAT",    
		    		 "P_RATING", "P_ANALYTICS_RATING", "P_COGNITIVE_RATING", "P_CLOUD_RATING",    
		    		 "P_MOBILE_RATING", "P_SOCIAL_RATING", "P_SECURITY_RATING",     
		    		 "P_RANKING", "P_ANALYTICS_RANKING", "P_COGNITIVE_RANKING", "P_CLOUD_RANKING",    
		    		 "P_MOBILE_RANKING", "P_SOCIAL_RANKING", "P_SECURITY_RANKING",     
		    		  "YEAR",  "MONTH",  "QUARTER",  "PIE_LABEL", "ICON_TEXT", "URL", "USER", "PW", "URL_TYPE"];
	return executeSql(influencerChartDataByMonthSql, mapping);
}

var influencerTableChartData = "SELECT current.COLUMN, current.SEQUENCE, current.DISPLAY_NAME, " +
		"current.METRIC_CODE, current.COMPANY, current.RANKING, current.TYPE, current.VALUE, " +
		"current.START_DATE, current.PY_START_DATE, " +
		"current.OVERALL_SUM, current.PY_OVERALL_SUM, current.OVERALL_PCT, current.RATING, " +
		"current.ANALYTICS_SUM, current.PY_ANALYTICS_SUM, current.ANALYTICS_PCT, current.ANALYTICS_RATING, " +
		"current.COGNITIVE_SUM, current.PY_COGNITIVE_SUM, current.COGNITIVE_PCT, current.COGNITIVE_RATING, " +
		"current.CLOUD_SUM, current.PY_CLOUD_SUM, current.CLOUD_PCT, current.CLOUD_RATING, " +
		"current.MOBILE_SUM, current.PY_MOBILE_SUM, current.MOBILE_PCT, current.MOBILE_RATING, " +
		"current.SOCIAL_SUM, current.PY_SOCIAL_SUM, current.SOCIAL_PCT, current.SOCIAL_RATING, " +
		"current.SECURITY_SUM, current.PY_SECURITY_SUM, current.SECURITY_PCT, current.SECURITY_RATING, " +
		"previous.RATING as P_RATING, previous.ANALYTICS_RATING as P_ANALYTICS_RATING, previous.COGNITIVE_RATING as P_COGNITIVE_RATING, previous.CLOUD_RATING as P_CLOUD_RATING, " +
		"previous.MOBILE_RATING as P_MOBILE_RATING, previous.SOCIAL_RATING as P_SOCIAL_RATING, " +
		"previous.SECURITY_RATING as P_SECURITY_RATING, previous.RANKING as P_RANKING, " + 
		"current.DATA_PERIOD_TYPE " +
		"FROM " +
		"(select DISTINCT COLUMN, SEQUENCE, DISPLAY_NAME, METRIC_CODE, COMPANY, RANKING, TYPE, VALUE,  "+
		"	START_DATE, PY_START_DATE,   "+
		"	OVERALL_SUM, PY_OVERALL_SUM, OVERALL_PCT, RATING, " +
		"   ANALYTICS_SUM, PY_ANALYTICS_SUM, ANALYTICS_PCT, ANALYTICS_RATING, " +
		"   COGNITIVE_SUM, PY_COGNITIVE_SUM, COGNITIVE_PCT, COGNITIVE_RATING, " +
		"   CLOUD_SUM, PY_CLOUD_SUM, CLOUD_PCT, CLOUD_RATING, " +
		"   MOBILE_SUM, PY_MOBILE_SUM, MOBILE_PCT, MOBILE_RATING, " +
		"   SOCIAL_SUM, PY_SOCIAL_SUM, SOCIAL_PCT, SOCIAL_RATING, " +
		"   SECURITY_SUM, PY_SECURITY_SUM, SECURITY_PCT, SECURITY_RATING, " +
		"   DATA_PERIOD_TYPE " +
		"	from BHMS.V_BHMS_INFLUENCER_LIST_DATA     "+
		"	WHERE  CURRENT = 'Y'     "+
		"	AND COUNTRY_NAME = p_country     "+
		"   AND COLUMN = p_column " + 
		"	AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y'   "+
		"	AND USER_PROFILE = p_profile) "+
		") current "+
		"left join( "+
		"select MAX(CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE)) AS MAX_DATE,  "+
		"second.SEQUENCE AS SEQUENCE_T, second.METRIC_CODE as METRIC_CODE_T   "+
		"from BHMS.V_BHMS_INFLUENCER_LIST_DATA first "+
		"join BHMS.V_BHMS_INFLUENCER_LIST_DATA second "+
		"on first.SEQUENCE = second.SEQUENCE "+
		"and first.METRIC_CODE = second.METRIC_CODE "+
		"and first.COUNTRY_NAME = second.COUNTRY_NAME "+
		"and first.COLUMN = second.COLUMN " +
		"and first.COUNTRY_NAME = p_country "+
		"and first.COLUMN = p_column " + 
		"and second.CURRENT = 'Y'  "+
		"and CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE) <=  " +
		" 	 case when second.DATA_PERIOD_TYPE = 'MONTHLY' then       " +
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 MONTH       "+
		" 	 when second.DATA_PERIOD_TYPE = 'QUARTERLY' then       "+
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 3 MONTHS       "+
		" 	 when second.DATA_PERIOD_TYPE = 'ANNUAL' then       "+
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 YEAR       "+
		" 	 when second.DATA_PERIOD_TYPE = 'SEMI_ANNUAL' then       "+
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 6 MONTHS       "+
		" 	 when second.DATA_PERIOD_TYPE = 'WEEKLY' then       "+
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 7 DAYS       "+
		" 	 else CAST('1900-1-1' AS DATE) end "+
		"group by second.SEQUENCE, second.METRIC_CODE "+
		") join_table "+
		"on current.SEQUENCE = join_table.SEQUENCE_T  "+
		"and current.METRIC_CODE = join_table.METRIC_CODE_T  "+
		"left join "+
		"(select distinct SEQUENCE,METRIC_CODE,YEAR,MONTH, RATING, ANALYTICS_RATING, COGNITIVE_RATING, CLOUD_RATING,  "+
		"   MOBILE_RATING, SOCIAL_RATING, SECURITY_RATING, RANKING, COMPANY, TYPE " +
		"	from BHMS.V_BHMS_INFLUENCER_LIST_DATA  "+
		"	where COUNTRY_NAME = p_country  "+
		"   and COLUMN = p_column " +
		") previous  "+
		"on join_table.SEQUENCE_T = previous.SEQUENCE   "+
		"and join_table.METRIC_CODE_T = previous.METRIC_CODE  "+
		"and previous.COMPANY = current.COMPANY "+
		"and previous.TYPE = current.TYPE "+
		"and CAST(trim(previous.YEAR)||'-'||trim(previous.MONTH)||'-01' AS DATE) = join_table.MAX_DATE   "+
		"ORDER BY COLUMN, SEQUENCE, RANKING";

var influencerTableChartDataByMonth = "SELECT current.COLUMN, current.SEQUENCE, current.DISPLAY_NAME, " +
		"current.METRIC_CODE, current.COMPANY, current.RANKING, current.TYPE, current.VALUE, " +
		"current.START_DATE, current.PY_START_DATE, " +
		"current.OVERALL_SUM, current.PY_OVERALL_SUM, current.OVERALL_PCT, current.RATING, " +
		"current.ANALYTICS_SUM, current.PY_ANALYTICS_SUM, current.ANALYTICS_PCT, current.ANALYTICS_RATING, " +
		"current.COGNITIVE_SUM, current.PY_COGNITIVE_SUM, current.COGNITIVE_PCT, current.COGNITIVE_RATING, " +
		"current.CLOUD_SUM, current.PY_CLOUD_SUM, current.CLOUD_PCT, current.CLOUD_RATING, " +
		"current.MOBILE_SUM, current.PY_MOBILE_SUM, current.MOBILE_PCT, current.MOBILE_RATING, " +
		"current.SOCIAL_SUM, current.PY_SOCIAL_SUM, current.SOCIAL_PCT, current.SOCIAL_RATING, " +
		"current.SECURITY_SUM, current.PY_SECURITY_SUM, current.SECURITY_PCT, current.SECURITY_RATING, " +
		"previous.RATING as P_RATING, previous.ANALYTICS_RATING as P_ANALYTICS_RATING, previous.COGNITIVE_RATING as P_COGNITIVE_RATING, previous.CLOUD_RATING as P_CLOUD_RATING, " +
		"previous.MOBILE_RATING as P_MOBILE_RATING, previous.SOCIAL_RATING as P_SOCIAL_RATING, " +
		"previous.SECURITY_RATING as P_SECURITY_RATING, previous.RANKING as P_RANKING, " + 
		"current.DATA_PERIOD_TYPE " +
		"FROM " +
		"(select DISTINCT COLUMN, SEQUENCE, DISPLAY_NAME, METRIC_CODE, COMPANY, RANKING, TYPE, VALUE,  "+
		"	START_DATE, PY_START_DATE,   "+
		"	OVERALL_SUM, PY_OVERALL_SUM, OVERALL_PCT, RATING, " +
		"   ANALYTICS_SUM, PY_ANALYTICS_SUM, ANALYTICS_PCT, ANALYTICS_RATING, " +
		"   COGNITIVE_SUM, PY_COGNITIVE_SUM, COGNITIVE_PCT, COGNITIVE_RATING, " +
		"   CLOUD_SUM, PY_CLOUD_SUM, CLOUD_PCT, CLOUD_RATING, " +
		"   MOBILE_SUM, PY_MOBILE_SUM, MOBILE_PCT, MOBILE_RATING, " +
		"   SOCIAL_SUM, PY_SOCIAL_SUM, SOCIAL_PCT, SOCIAL_RATING, " +
		"   SECURITY_SUM, PY_SECURITY_SUM, SECURITY_PCT, SECURITY_RATING, " +
		"   DATA_PERIOD_TYPE " +
		"	from BHMS.V_BHMS_INFLUENCER_LIST_DATA     "+
		"   join "+
		"   (SELECT DISTINCT MAX(CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE)) AS MAX_DATE,     "+
		"	   SEQUENCE as SEQUENCE_T,  METRIC_CODE as METRIC_CODE_T "+
		"	   FROM BHMS.V_BHMS_INFLUENCER_LIST_DATA     "+
		"	   WHERE COUNTRY_NAME = p_country    "+
		"	   AND COLUMN = p_column    "+
		"	   AND CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE) <= CAST(p_year||'-'||p_month||'-01' AS DATE)    "+
		"	   GROUP BY SEQUENCE, METRIC_CODE    "+
		"    ) TMP   "+
		"    on CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE) = TMP.MAX_DATE "+
		"    and SEQUENCE = TMP.SEQUENCE_T "+
		"    and METRIC_CODE = TMP.METRIC_CODE_T "+
		"	AND COUNTRY_NAME = p_country       "+
		"	AND COLUMN = p_column     "+
		"	AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y'   "+
		"	AND USER_PROFILE = p_profile) "+
		") current  "+
		"left join "+
		"(select MAX(CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE)) AS MAX_DATE,  "+
		"second.SEQUENCE AS SEQUENCE_T, second.METRIC_CODE as METRIC_CODE_T   "+
		"from BHMS.V_BHMS_INFLUENCER_LIST_DATA first "+
		"join BHMS.V_BHMS_INFLUENCER_LIST_DATA second "+
		"on first.SEQUENCE = second.SEQUENCE "+
		"and first.METRIC_CODE = second.METRIC_CODE "+
		"and first.COUNTRY_NAME = second.COUNTRY_NAME "+
		"and first.COLUMN = second.COLUMN "+
		"and first.COUNTRY_NAME = p_country "+
		"and first.COLUMN = p_column "+
		"join "+
		"(SELECT DISTINCT MAX(CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE)) AS MAX_DATE,     "+
		"	 SEQUENCE,  METRIC_CODE "+
		"	 FROM BHMS.V_BHMS_INFLUENCER_LIST_DATA     "+
		"	 WHERE COUNTRY_NAME = p_country    "+
		"	 AND COLUMN = p_column    "+
		"	 AND CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE) <= CAST(p_year||'-'||p_month||'-01' AS DATE)    "+
		"	 GROUP BY SEQUENCE, METRIC_CODE    "+
		") TMP   "+
		"on CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE) = TMP.MAX_DATE  "+
		"and second.SEQUENCE = TMP.SEQUENCE "+
		"and second.METRIC_CODE = TMP.METRIC_CODE "+
		"and CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE) <=  "+
		"	 case when second.DATA_PERIOD_TYPE = 'MONTHLY' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 MONTH    "+
		"	 when second.DATA_PERIOD_TYPE = 'QUARTERLY' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 3 MONTHS    "+
		"	 when second.DATA_PERIOD_TYPE = 'ANNUAL' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 YEAR    "+
		"	 when second.DATA_PERIOD_TYPE = 'SEMI_ANNUAL' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 6 MONTHS    "+
		"	 when second.DATA_PERIOD_TYPE = 'WEEKLY' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 7 DAYS    "+
		"	 else CAST('1900-1-1' AS DATE) end "+
		"group by second.SEQUENCE, second.METRIC_CODE "+
		") join_table "+
		"on current.SEQUENCE = join_table.SEQUENCE_T "+
		"and current.METRIC_CODE = join_table.METRIC_CODE_T "+
		"left join "+
		"(select distinct SEQUENCE,METRIC_CODE,YEAR,MONTH, RATING, ANALYTICS_RATING, COGNITIVE_RATING, CLOUD_RATING,  "+
		"   MOBILE_RATING, SOCIAL_RATING, SECURITY_RATING, RANKING, COMPANY, TYPE " +
		"	from BHMS.V_BHMS_INFLUENCER_LIST_DATA  "+
		"	where COUNTRY_NAME = p_country  "+
		"   and COLUMN = p_column " +
		") previous  "+
		"on join_table.SEQUENCE_T = previous.SEQUENCE   "+
		"and join_table.METRIC_CODE_T = previous.METRIC_CODE  "+
		"and previous.COMPANY = current.COMPANY "+
		"and previous.TYPE = current.TYPE "+
		"and CAST(trim(previous.YEAR)||'-'||trim(previous.MONTH)||'-01' AS DATE) = join_table.MAX_DATE   "+
		"ORDER BY COLUMN, SEQUENCE, RANKING";

function getInfluencerTableChartData(country, column, profile) {
	var influencerTableChartDataSql = influencerTableChartData.replace(/p_country/g, quoteWrap(country));
	influencerTableChartDataSql = influencerTableChartDataSql.replace(/p_column/g, column);
	influencerTableChartDataSql = influencerTableChartDataSql.replace(/p_profile/g, quoteWrap(profile));
	var mapping = ["COLUMN",  "SEQUENCE",  "DISPLAY_NAME",    
	      		  "METRIC_CODE",  "COMPANY",  "RANKING",  "TYPE",  "VALUE",    
	    		  "START_DATE",  "PY_START_DATE",    
	    		  "OVERALL_SUM",  "PY_OVERALL_SUM",  "OVERALL_PCT",  "RATING",    
	    		  "ANALYTICS_SUM",  "PY_ANALYTICS_SUM",  "ANALYTICS_PCT",  "ANALYTICS_RATING", 
	    		  "COGNITIVE_SUM",  "PY_COGNITIVE_SUM",  "COGNITIVE_PCT",  "COGNITIVE_RATING",   
	    		  "CLOUD_SUM",  "PY_CLOUD_SUM",  "CLOUD_PCT",  "CLOUD_RATING",    
	    		  "MOBILE_SUM",  "PY_MOBILE_SUM",  "MOBILE_PCT",  "MOBILE_RATING",    
	    		  "SOCIAL_SUM",  "PY_SOCIAL_SUM",  "SOCIAL_PCT",  "SOCIAL_RATING",    
	    		  "SECURITY_SUM",  "PY_SECURITY_SUM",  "SECURITY_PCT",  "SECURITY_RATING",    
	    		  "P_RATING",  "P_ANALYTICS_RATING",  "P_COGNITIVE_RATING", "P_CLOUD_RATING",    
	    		  "P_MOBILE_RATING",  "P_SOCIAL_RATING",    
	    		  "P_SECURITY_RATING",  "P_RANKING",     
	    		  "DATA_PERIOD_TYPE"];
	return executeSql(influencerTableChartDataSql, mapping);
}

function getInfluencerTableChartDataByMonth(country, column, year, month, profile) {
	var influencerTableChartDataByMonthSql = influencerTableChartDataByMonth.replace(/p_country/g, quoteWrap(country));
	influencerTableChartDataByMonthSql = influencerTableChartDataByMonthSql.replace(/p_column/g, column);
	influencerTableChartDataByMonthSql = influencerTableChartDataByMonthSql.replace(/p_year/g, quoteWrap(year));
	influencerTableChartDataByMonthSql = influencerTableChartDataByMonthSql.replace(/p_month/g, quoteWrap(month));
	influencerTableChartDataByMonthSql = influencerTableChartDataByMonthSql.replace(/p_profile/g, quoteWrap(profile));
	var mapping = ["COLUMN",  "SEQUENCE",  "DISPLAY_NAME",    
		      		  "METRIC_CODE",  "COMPANY",  "RANKING",  "TYPE",  "VALUE",    
		    		  "START_DATE",  "PY_START_DATE",    
		    		  "OVERALL_SUM",  "PY_OVERALL_SUM",  "OVERALL_PCT",  "RATING",    
		    		  "ANALYTICS_SUM",  "PY_ANALYTICS_SUM",  "ANALYTICS_PCT",  "ANALYTICS_RATING",    
		    		  "COGNITIVE_SUM",  "PY_COGNITIVE_SUM",  "COGNITIVE_PCT",  "COGNITIVE_RATING",
		    		  "CLOUD_SUM",  "PY_CLOUD_SUM",  "CLOUD_PCT",  "CLOUD_RATING",    
		    		  "MOBILE_SUM",  "PY_MOBILE_SUM",  "MOBILE_PCT",  "MOBILE_RATING",    
		    		  "SOCIAL_SUM",  "PY_SOCIAL_SUM",  "SOCIAL_PCT",  "SOCIAL_RATING",    
		    		  "SECURITY_SUM",  "PY_SECURITY_SUM",  "SECURITY_PCT",  "SECURITY_RATING",    
		    		  "P_RATING",  "P_ANALYTICS_RATING",  "P_COGNITIVE_RATING", "P_CLOUD_RATING",    
		    		  "P_MOBILE_RATING",  "P_SOCIAL_RATING",    
		    		  "P_SECURITY_RATING",  "P_RANKING",     
		    		  "DATA_PERIOD_TYPE"];
	return executeSql(influencerTableChartDataByMonthSql, mapping);
}

var influencerChartClassData = "SELECT current.PAGE_CHART_TYPE, current.COLUMN, current.SEQUENCE, current.METRIC_CODE, current.DISPLAY_NAME,   "+
		"current.COMPANY, current.RANKING, current.RATING, current.TYPE, " + 
		"current.SAMPLE_SIZE_MESSAGE, current.SAMPLE_SIZE_ANALYTICS, current.SAMPLE_SIZE_CLOUD, current.SAMPLE_SIZE_MOBILE, " + 
		"current.SAMPLE_SIZE_SOCIAL, current.SAMPLE_SIZE_SECURITY, " +
		"current.VALUE, current.OVERALL_SUM, current.ANALYTICS_SUM, current.ANALYTICS_RATING, current.CLOUD_SUM, current.CLOUD_RATING,  "+
		"current.MOBILE_SUM, current.MOBILE_RATING, current.SOCIAL_SUM, current.SOCIAL_RATING, "+
		"current.SECURITY_SUM, current.SECURITY_RATING, current.DATA_PERIOD_TYPE, " +
		"current.NUMERIC_FORMAT, current.RANKING_DISPLAY, current.YEAR, previous.RATING as P_RATING, previous.RANKING as P_RANKING, " +
		"current.MONTH, current.QUARTER, current.PIE_LABEL, CURRENT.ICON_TEXT, " + addDetailUrlField +
		"from "+
		"(select DISTINCT PAGE_CHART_TYPE, COLUMN, SEQUENCE, METRIC_CODE,  DISPLAY_NAME,   "+
		"	COMPANY, RANKING, RATING, TYPE,  "+
		"	SAMPLE_SIZE_MESSAGE, SAMPLE_SIZE_ANALYTICS, SAMPLE_SIZE_CLOUD, SAMPLE_SIZE_MOBILE,   "+
		"	SAMPLE_SIZE_SOCIAL, SAMPLE_SIZE_SECURITY, " +
		"	VALUE, OVERALL_SUM, ANALYTICS_SUM, ANALYTICS_RATING, CLOUD_SUM, CLOUD_RATING, " +
		"   MOBILE_SUM, MOBILE_RATING, SOCIAL_SUM, SOCIAL_RATING, " +
		"   SECURITY_SUM, SECURITY_RATING, DATA_PERIOD_TYPE, " +
		"   NUMERIC_FORMAT, RANKING_DISPLAY, YEAR, " +
		"   MONTH, QUARTER, PIE_LABEL, ICON_TEXT, " + addDetailUrlField +
		"	from BHMS.V_BHMS_INFLUENCER_CHART_CLASS_DATA     "+
		"	WHERE  CURRENT = 'Y'     "+
		"	AND COUNTRY_NAME = p_country     "+
		"	AND COLUMN = p_column   "+
		"   AND IBMER = p_ibmer  " +
		"	AND METRIC_CODE <> 'PR12' " +
		"	AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y'   "+
		"	AND USER_PROFILE = p_profile) "+
		") current "+
		"left join( "+
		"select MAX(CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE)) AS MAX_DATE,  "+
		"second.SEQUENCE AS SEQUENCE_T, second.METRIC_CODE as METRIC_CODE_T   "+
		"from BHMS.V_BHMS_INFLUENCER_CHART_CLASS_DATA first "+
		"join BHMS.V_BHMS_INFLUENCER_CHART_CLASS_DATA second "+
		"on first.SEQUENCE = second.SEQUENCE "+
		"and first.METRIC_CODE = second.METRIC_CODE "+
		"and first.COUNTRY_NAME = second.COUNTRY_NAME "+
		"and first.COLUMN = second.COLUMN "+
		"and first.IBMER = second.IBMER "+
		"and first.COUNTRY_NAME = p_country "+
		"and first.COLUMN = p_column "+
		"and first.METRIC_CODE <> 'PR12' " +
		"and second.CURRENT = 'Y'  "+
		"and second.IBMER = p_ibmer  " +
		"and CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE) <=  "+
		" 	 case when second.DATA_PERIOD_TYPE = 'MONTHLY' then       "+
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 MONTH       "+
		" 	 when second.DATA_PERIOD_TYPE = 'QUARTERLY' then       "+
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 3 MONTHS       "+
		" 	 when second.DATA_PERIOD_TYPE = 'ANNUAL' then       "+
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 YEAR       "+
		" 	 when second.DATA_PERIOD_TYPE = 'SEMI_ANNUAL' then       "+
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 6 MONTHS       "+
		" 	 when second.DATA_PERIOD_TYPE = 'WEEKLY' then       "+
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 7 DAYS       "+
		" 	 else CAST('1900-1-1' AS DATE) end  "+
		"group by second.SEQUENCE, second.METRIC_CODE "+
		") join_table "+
		"on current.SEQUENCE = join_table.SEQUENCE_T  "+
		"and current.METRIC_CODE = join_table.METRIC_CODE_T  "+
		"left join "+
		"(select distinct SEQUENCE,METRIC_CODE,YEAR,MONTH,RATING,  "+
		"   RANKING, COMPANY, TYPE " +
		"	from BHMS.V_BHMS_INFLUENCER_CHART_CLASS_DATA  "+
		"	where COUNTRY_NAME = p_country AND COLUMN = p_column AND IBMER = p_ibmer AND METRIC_CODE <> 'PR12' "+
		") previous  "+
		"on join_table.SEQUENCE_T = previous.SEQUENCE   "+
		"and join_table.METRIC_CODE_T = previous.METRIC_CODE  "+
		"and previous.COMPANY = current.COMPANY "+
		"and previous.TYPE = current.TYPE "+
		"and CAST(trim(previous.YEAR)||'-'||trim(previous.MONTH)||'-01' AS DATE) = join_table.MAX_DATE   "+
		"ORDER BY COLUMN,SEQUENCE, RANKING ";

var influencerChartClassDataByMonth = "SELECT current.PAGE_CHART_TYPE, current.COLUMN, current.SEQUENCE, current.METRIC_CODE, current.DISPLAY_NAME,   "+
		"current.COMPANY, current.RANKING, current.RATING, current.TYPE, " + 
		"current.SAMPLE_SIZE_MESSAGE, current.SAMPLE_SIZE_ANALYTICS, current.SAMPLE_SIZE_CLOUD, current.SAMPLE_SIZE_MOBILE, " + 
		"current.SAMPLE_SIZE_SOCIAL, current.SAMPLE_SIZE_SECURITY, " +
		"current.VALUE, current.OVERALL_SUM, current.ANALYTICS_SUM, current.ANALYTICS_RATING, current.CLOUD_SUM, current.CLOUD_RATING,  "+
		"current.MOBILE_SUM, current.MOBILE_RATING, current.SOCIAL_SUM, current.SOCIAL_RATING, "+
		"current.SECURITY_SUM, current.SECURITY_RATING, current.DATA_PERIOD_TYPE, " +
		"current.NUMERIC_FORMAT, current.RANKING_DISPLAY, current.YEAR, previous.RATING as P_RATING, previous.RANKING as P_RANKING, " +
		"current.MONTH, current.QUARTER, current.PIE_LABEL, CURRENT.ICON_TEXT, " + addDetailUrlField +
		"from "+
		"(select DISTINCT PAGE_CHART_TYPE, COLUMN, SEQUENCE, METRIC_CODE,  DISPLAY_NAME,   "+
		"	COMPANY, RANKING, RATING, TYPE,  "+
		"	SAMPLE_SIZE_MESSAGE, SAMPLE_SIZE_ANALYTICS, SAMPLE_SIZE_CLOUD, SAMPLE_SIZE_MOBILE,   "+
		"	SAMPLE_SIZE_SOCIAL, SAMPLE_SIZE_SECURITY, " +
		"	VALUE, OVERALL_SUM, ANALYTICS_SUM, ANALYTICS_RATING, CLOUD_SUM, CLOUD_RATING, " +
		"   MOBILE_SUM, MOBILE_RATING, SOCIAL_SUM, SOCIAL_RATING, " +
		"   SECURITY_SUM, SECURITY_RATING, DATA_PERIOD_TYPE, " +
		"   NUMERIC_FORMAT, RANKING_DISPLAY, YEAR, " +
		"   MONTH, QUARTER, PIE_LABEL, ICON_TEXT, " + addDetailUrlField +
		"	from BHMS.V_BHMS_INFLUENCER_CHART_CLASS_DATA     "+
		"   join "+
		"   (SELECT DISTINCT MAX(CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE)) AS MAX_DATE,     "+
		"	   SEQUENCE as SEQUENCE_T,  METRIC_CODE as METRIC_CODE_T "+
		"	   FROM BHMS.V_BHMS_INFLUENCER_CHART_CLASS_DATA     "+
		"	   WHERE COUNTRY_NAME = p_country "+
		"	   AND COLUMN = p_column    "+
		"      AND IBMER = p_ibmer  " +
		"	   AND METRIC_CODE <> 'PR12' " +
		"	   AND CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE) <= CAST(p_year||'-'||p_month||'-01' AS DATE)    "+
		"	   GROUP BY SEQUENCE, METRIC_CODE    "+
		"    ) TMP   "+
		"    on CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE) = TMP.MAX_DATE "+
		"    and SEQUENCE = TMP.SEQUENCE_T "+
		"    and METRIC_CODE = TMP.METRIC_CODE_T "+
		"	AND COUNTRY_NAME = p_country       "+
		"	AND COLUMN = p_column     "+
		"   AND IBMER = p_ibmer  " +
		"	AND METRIC_CODE <> 'PR12' " +
		"	AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y'   "+
		"	AND USER_PROFILE = p_profile) "+
		") current  "+
		"left join "+
		"(select MAX(CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE)) AS MAX_DATE,  "+
		"second.SEQUENCE AS SEQUENCE_T, second.METRIC_CODE as METRIC_CODE_T   "+
		"from BHMS.V_BHMS_INFLUENCER_CHART_CLASS_DATA first "+
		"join BHMS.V_BHMS_INFLUENCER_CHART_CLASS_DATA second "+
		"on first.SEQUENCE = second.SEQUENCE "+
		"and first.METRIC_CODE = second.METRIC_CODE "+
		"and first.COUNTRY_NAME = second.COUNTRY_NAME "+
		"and first.COLUMN = second.COLUMN "+
		"and first.IBMER = second.IBMER "+
		"and first.COUNTRY_NAME = p_country "+
		"and first.COLUMN = p_column "+
		"and first.IBMER = p_ibmer  " +
		"and first.METRIC_CODE <> 'PR12' " +
		"join "+
		"(SELECT DISTINCT MAX(CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE)) AS MAX_DATE,     "+
		"	 SEQUENCE,  METRIC_CODE "+
		"	 FROM BHMS.V_BHMS_INFLUENCER_CHART_CLASS_DATA     "+
		"	 WHERE COUNTRY_NAME = p_country    "+
		"	 AND COLUMN = p_column    "+
		"    AND IBMER = p_ibmer  " +
		"	 AND METRIC_CODE <> 'PR12' " +
		"	 AND CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE) <= CAST(p_year||'-'||p_month||'-01' AS DATE)    "+
		"	 GROUP BY SEQUENCE, METRIC_CODE    "+
		") TMP   "+
		"on CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE) = TMP.MAX_DATE  "+
		"and second.SEQUENCE = TMP.SEQUENCE "+
		"and second.METRIC_CODE = TMP.METRIC_CODE "+
		"and CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE) <=  "+
		"	 case when second.DATA_PERIOD_TYPE = 'MONTHLY' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 MONTH    "+
		"	 when second.DATA_PERIOD_TYPE = 'QUARTERLY' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 3 MONTHS    "+
		"	 when second.DATA_PERIOD_TYPE = 'ANNUAL' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 YEAR    "+
		"	 when second.DATA_PERIOD_TYPE = 'SEMI_ANNUAL' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 6 MONTHS    "+
		"	 when second.DATA_PERIOD_TYPE = 'WEEKLY' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 7 DAYS    "+
		"	 else CAST('1900-1-1' AS DATE) end "+
		"group by second.SEQUENCE, second.METRIC_CODE "+
		") join_table "+
		"on current.SEQUENCE = join_table.SEQUENCE_T "+
		"and current.METRIC_CODE = join_table.METRIC_CODE_T "+
		"left join "+
		"(select distinct SEQUENCE,METRIC_CODE,YEAR,MONTH,RATING,  "+
		"   RANKING, COMPANY, TYPE " +
		"	from BHMS.V_BHMS_INFLUENCER_CHART_CLASS_DATA  "+
		"	where COUNTRY_NAME = p_country AND COLUMN = p_column AND IBMER = p_ibmer  "+
		") previous  "+
		"on join_table.SEQUENCE_T = previous.SEQUENCE   "+
		"and join_table.METRIC_CODE_T = previous.METRIC_CODE  "+
		"and previous.COMPANY = current.COMPANY "+
		"and previous.TYPE = current.TYPE "+
		"and CAST(trim(previous.YEAR)||'-'||trim(previous.MONTH)||'-01' AS DATE) = join_table.MAX_DATE   "+
		"ORDER BY COLUMN,SEQUENCE, RANKING ";

function getInfluencerChartClassData(country, column, ibmer, profile) {
	var influencerChartClassDataSql = influencerChartClassData.replace(/p_country/g, quoteWrap(country));
	influencerChartClassDataSql = influencerChartClassDataSql.replace(/p_column/g, column);
	influencerChartClassDataSql = influencerChartClassDataSql.replace(/p_ibmer/g, quoteWrap(ibmer));
	influencerChartClassDataSql = influencerChartClassDataSql.replace(/p_profile/g, quoteWrap(profile));
	var mapping = ["PAGE_CHART_TYPE",  "COLUMN",  "SEQUENCE",  "METRIC_CODE",  "DISPLAY_NAME", 
           		  "COMPANY",  "RANKING",  "RATING",  "TYPE",     
           		  "SAMPLE_SIZE_MESSAGE", "SAMPLE_SIZE_ANALYTICS", "SAMPLE_SIZE_CLOUD", "SAMPLE_SIZE_MOBILE", 
           		  "SAMPLE_SIZE_SOCIAL", "SAMPLE_SIZE_SECURITY",
        		  "VALUE",  "OVERALL_SUM",  "ANALYTICS_SUM",  "ANALYTICS_RATING",  "CLOUD_SUM",  "CLOUD_RATING",    
        		  "MOBILE_SUM",  "MOBILE_RATING",  "SOCIAL_SUM",  "SOCIAL_RATING",   
        		  "SECURITY_SUM",  "SECURITY_RATING",  "DATA_PERIOD_TYPE",    
        		  "NUMERIC_FORMAT",  "RANKING_DISPLAY",  "YEAR",  "P_RATING",  "P_RANKING",    
        		  "MONTH",  "QUARTER",  "PIE_LABEL", "ICON_TEXT",  "URL", "USER", "PW", "URL_TYPE"];
	return executeSql(influencerChartClassDataSql, mapping);
}

function getInfluencerChartClassDataByMonth(country, column, ibmer, year, month, profile) {
	var influencerChartClassDataByMonthSql = influencerChartClassDataByMonth.replace(/p_country/g, quoteWrap(country));
	influencerChartClassDataByMonthSql = influencerChartClassDataByMonthSql.replace(/p_column/g, column);
	influencerChartClassDataByMonthSql = influencerChartClassDataByMonthSql.replace(/p_ibmer/g, quoteWrap(ibmer));
	influencerChartClassDataByMonthSql = influencerChartClassDataByMonthSql.replace(/p_year/g, quoteWrap(year));
	influencerChartClassDataByMonthSql = influencerChartClassDataByMonthSql.replace(/p_month/g, quoteWrap(month));
	influencerChartClassDataByMonthSql = influencerChartClassDataByMonthSql.replace(/p_profile/g, quoteWrap(profile));
	var mapping = ["PAGE_CHART_TYPE",  "COLUMN",  "SEQUENCE",  "METRIC_CODE",  "DISPLAY_NAME", 
	           		  "COMPANY",  "RANKING",  "RATING",  "TYPE",   
	           		  "SAMPLE_SIZE_MESSAGE", "SAMPLE_SIZE_ANALYTICS", "SAMPLE_SIZE_CLOUD", "SAMPLE_SIZE_MOBILE", 
	           		  "SAMPLE_SIZE_SOCIAL", "SAMPLE_SIZE_SECURITY",
	        		  "VALUE",  "OVERALL_SUM",  "ANALYTICS_SUM",  "ANALYTICS_RATING", "CLOUD_SUM",  "CLOUD_RATING",    
	        		  "MOBILE_SUM",  "MOBILE_RATING",  "SOCIAL_SUM",  "SOCIAL_RATING",   
	        		  "SECURITY_SUM",  "SECURITY_RATING",  "DATA_PERIOD_TYPE",    
	        		  "NUMERIC_FORMAT",  "RANKING_DISPLAY",  "YEAR",  "P_RATING",  "P_RANKING",    
	        		  "MONTH",  "QUARTER",  "PIE_LABEL",  "URL", "USER", "PW", "URL_TYPE"];
	return executeSql(influencerChartClassDataByMonthSql, mapping);
}



var developerDashboardListsReportStatement   = WL.Server.createSQLStatement(
		"SELECT " +
			"DISTINCT CONSTITUENTS, " +
			"COLUMN,  " +
			"SEQUENCE, " +
			"DISPLAY_VALUE , " +
			"METRIC_CODE,  " +
			"COMPANY,  " +
			"COLOR_CODE,  " +
			"DISPLAY_NAME,  " +
			"ICON_TEXT  " +
		"FROM BHMS.V_BHMS_DASHBOARD_RANKED_LISTS_DATA " +
		"WHERE COUNTRY_NAME= ? AND CONSTITUENTS = 'DEVELOPERS' AND CURRENT='Y' " +
		"AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y' AND USER_PROFILE = ?) " +
		"ORDER BY COLUMN, SEQUENCE"
);

var developerDashboardListsReportByMonthStatement   = WL.Server.createSQLStatement(
		"SELECT " +
			"DISTINCT CONSTITUENTS, " +
			"COLUMN,  " +
			"SEQUENCE, " +
			"DISPLAY_VALUE , " +
			"METRIC_CODE,  " +
			"COMPANY,  " +
			"COLOR_CODE,  " +
			"DISPLAY_NAME,  " +
			"ICON_TEXT  " +
		"FROM BHMS.V_BHMS_DASHBOARD_RANKED_LISTS_DATA , (SELECT DISTINCT MAX(TO_NUMBER(TRIM(YEAR)||LPAD(TRIM(LTRIM(MONTH,'0')), 2, '0'))) AS MAX_DATE, COLUMN AS COLUMN_T, SEQUENCE AS SEQUENCE_T " +
		"FROM BHMS.V_BHMS_DASHBOARD_RANKED_LISTS_DATA " +
			"WHERE COUNTRY_NAME = ? " +
			"AND CONSTITUENTS = 'DEVELOPERS' " +
			"AND TO_NUMBER(TRIM(YEAR)||LPAD(TRIM(LTRIM(MONTH,'0')), 2, '0')) <= TO_NUMBER(?||LPAD(?, 2, '0')) " + 
			"GROUP BY COLUMN, SEQUENCE) TMP " + 
		"WHERE TO_NUMBER(TRIM(YEAR)||LPAD(TRIM(LTRIM(MONTH,'0')), 2, '0')) = TMP.MAX_DATE " +
			"AND COLUMN = TMP.COLUMN_T " +
			"AND SEQUENCE = TMP.SEQUENCE_T " +
			"AND COUNTRY_NAME= ? AND CONSTITUENTS = 'DEVELOPERS' " +
			"AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y' AND USER_PROFILE = ?) " +
			"ORDER BY COLUMN, SEQUENCE"
);

function getDeveloperDashboardListsReport(param) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : developerDashboardListsReportStatement,
		parameters : param
	});
}

function getDeveloperDashboardListsReportByMonth(country, year, month, profile) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : developerDashboardListsReportByMonthStatement,
		parameters : [country, year, month, country, profile]
	});
}

var developerDashboardBarChartDataStatement = WL.Server.createSQLStatement(
		"SELECT " +
			"DISTINCT CONSTITUENTS, " +
			"COLUMN, " +
			"SEQUENCE, " +
			"METRIC_CODE, " +
			"COMPANY, " +
			"RANKING, " +
			"VALUE, " +
			"MEASURE, " +
			"NUMERIC_FORMAT " +
		"FROM BHMS.V_BHMS_DASHBOARD_RANKED_BAR_CHARTS_DATA " +
			"WHERE COUNTRY_NAME= ? AND CONSTITUENTS = 'DEVELOPERS' AND CURRENT='Y' " +
			"AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y' AND USER_PROFILE = ?) " +
			"ORDER BY COLUMN, SEQUENCE");

var developerDashboardBarChartDataByMonthStatement = WL.Server.createSQLStatement(
		"SELECT " +
			"DISTINCT CONSTITUENTS, " +
			"COLUMN, " +
			"SEQUENCE, " +
			"METRIC_CODE, " +
			"COMPANY, " +
			"RANKING, " +
			"VALUE, " +
			"MEASURE, " +
			"NUMERIC_FORMAT " +
		"FROM BHMS.V_BHMS_DASHBOARD_RANKED_BAR_CHARTS_DATA , (SELECT DISTINCT MAX(TO_NUMBER(TRIM(YEAR)||LPAD(TRIM(LTRIM(MONTH,'0')), 2, '0'))) AS MAX_DATE, COLUMN AS COLUMN_T, SEQUENCE AS SEQUENCE_T " +
		"FROM BHMS.V_BHMS_DASHBOARD_RANKED_BAR_CHARTS_DATA " +
			"WHERE COUNTRY_NAME = ? " +
			"AND CONSTITUENTS = 'DEVELOPERS' " + 
			"AND TO_NUMBER(TRIM(YEAR)||LPAD(TRIM(LTRIM(MONTH,'0')), 2, '0')) <= TO_NUMBER(?||LPAD(?, 2, '0')) " + 
			"GROUP BY COLUMN, SEQUENCE) TMP " + 
			"WHERE TO_NUMBER(TRIM(YEAR)||LPAD(TRIM(LTRIM(MONTH,'0')), 2, '0')) = TMP.MAX_DATE " +
			"AND COLUMN = TMP.COLUMN_T " +
			"AND SEQUENCE = TMP.SEQUENCE_T " +
			"AND COUNTRY_NAME= ? AND CONSTITUENTS = 'DEVELOPERS' " + 
			"AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y' AND USER_PROFILE = ?) " +
			"ORDER BY COLUMN, SEQUENCE");
			
function getDeveloperDashboardBarChartData(param) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : developerDashboardBarChartDataStatement,
		parameters : param
	});
}

function getDeveloperDashboardBarChartDataByMonth(country, year, month, profile) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : developerDashboardBarChartDataByMonthStatement,
		parameters : [country, year, month, country, profile]
	});
}

var developerCurrent = 	"SELECT current.COLUMN, current.SEQUENCE, current.METRIC_CODE, current.COMPANY, current.RATING,   "+
		"current.RANKING, current.RANKING_DISPLAY, current.SAMPLE_SIZE_MESSAGE, current.TYPE, current.OVERALL_SUM,   "+
		"current.DATA_PERIOD_TYPE, current.DISPLAY_NAME, CURRENT.ICON_TEXT, previous.RATING as P_RATING, previous.RANKING as P_RANKING,       "+
		"current.YEAR, current.MONTH, current.QUARTER, current.PAGE_CHART_TYPE, current.NUMERIC_FORMAT, "+ addDetailUrlField +
		"from "+
		"(select DISTINCT COLUMN, SEQUENCE, METRIC_CODE, COMPANY, RATING, RANKING, RANKING_DISPLAY,   "+
		"	SAMPLE_SIZE_MESSAGE, TYPE, OVERALL_SUM, DATA_PERIOD_TYPE, DISPLAY_NAME,   "+
		"	YEAR, MONTH, QUARTER, PAGE_CHART_TYPE, NUMERIC_FORMAT, ICON_TEXT, "+ addDetailUrlField +
		"	from BHMS.V_BHMS_DEVELOPER_CHART_DATA     "+
		"	WHERE  CURRENT = 'Y'     "+
		"	AND COUNTRY_NAME = p_country     "+
		"	AND COLUMN = p_column   "+
		"	AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y'   "+
		"	AND USER_PROFILE = p_profile) "+
		") current "+
		"left join( "+
		"select MAX(CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE)) AS MAX_DATE,  "+
		"second.SEQUENCE AS SEQUENCE_T, second.METRIC_CODE as METRIC_CODE_T   "+
		"from BHMS.V_BHMS_DEVELOPER_CHART_DATA first "+
		"join BHMS.V_BHMS_DEVELOPER_CHART_DATA second "+
		"on first.SEQUENCE = second.SEQUENCE "+
		"and first.METRIC_CODE = second.METRIC_CODE "+
		"and first.COUNTRY_NAME = second.COUNTRY_NAME "+
		"and first.COLUMN = second.COLUMN "+
		"and first.COUNTRY_NAME = p_country "+
		"and first.COLUMN = p_column "+
		"and second.CURRENT = 'Y'  "+
		"and CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE) <=  "+
		" 	 case when second.DATA_PERIOD_TYPE = 'MONTHLY' then       "+
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 MONTH       "+
		" 	 when second.DATA_PERIOD_TYPE = 'QUARTERLY' then       "+
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 3 MONTHS       "+
		" 	 when second.DATA_PERIOD_TYPE = 'ANNUAL' then       "+
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 YEAR       "+
		" 	 when second.DATA_PERIOD_TYPE = 'SEMI_ANNUAL' then       "+
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 6 MONTHS       "+
		" 	 when second.DATA_PERIOD_TYPE = 'WEEKLY' then       "+
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 7 DAYS       "+
		" 	 else CAST('1900-1-1' AS DATE) end  "+
		"group by second.SEQUENCE, second.METRIC_CODE "+
		") join_table "+
		"on current.SEQUENCE = join_table.SEQUENCE_T  "+
		"and current.METRIC_CODE = join_table.METRIC_CODE_T  "+
		"left join "+
		"(select distinct SEQUENCE,METRIC_CODE,YEAR,MONTH,RATING, RANKING, COMPANY, TYPE "+
		"	from BHMS.V_BHMS_DEVELOPER_CHART_DATA  "+
		"	where COUNTRY_NAME = p_country AND COLUMN = p_column "+
		") previous  "+
		"on join_table.SEQUENCE_T = previous.SEQUENCE   "+
		"and join_table.METRIC_CODE_T = previous.METRIC_CODE  "+
		"and previous.COMPANY = current.COMPANY "+
		"and previous.TYPE = current.TYPE "+
		"and CAST(trim(previous.YEAR)||'-'||trim(previous.MONTH)||'-01' AS DATE) = join_table.MAX_DATE   "+
		"ORDER BY COLUMN, SEQUENCE, COMPANY, RANKING  ";

var developerByMonth = "SELECT current.COLUMN, current.SEQUENCE, current.METRIC_CODE, current.COMPANY, current.RATING,  "+
		"current.RANKING, current.RANKING_DISPLAY, current.SAMPLE_SIZE_MESSAGE, current.TYPE, current.OVERALL_SUM,  "+
		"current.DATA_PERIOD_TYPE, current.DISPLAY_NAME, CURRENT.ICON_TEXT, previous.RATING as P_RATING, previous.RANKING as P_RANKING,     "+    
		"current.YEAR, current.MONTH, current.QUARTER, current.PAGE_CHART_TYPE, current.NUMERIC_FORMAT,  "+ addDetailUrlField +
		"from      "+
		"(select DISTINCT COLUMN, SEQUENCE, METRIC_CODE, COMPANY, RATING, RANKING, RANKING_DISPLAY,  "+
		"	SAMPLE_SIZE_MESSAGE, TYPE, OVERALL_SUM, DATA_PERIOD_TYPE, DISPLAY_NAME,    "+
		"	YEAR, MONTH, QUARTER, PAGE_CHART_TYPE, NUMERIC_FORMAT, ICON_TEXT,    "+ addDetailUrlField +
		"	from BHMS.V_BHMS_DEVELOPER_CHART_DATA    "+
		"   join "+
		"   (SELECT DISTINCT MAX(CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE)) AS MAX_DATE,     "+
		"	   SEQUENCE as SEQUENCE_T,  METRIC_CODE as METRIC_CODE_T "+
		"	   FROM BHMS.V_BHMS_DEVELOPER_CHART_DATA     "+
		"	   WHERE COUNTRY_NAME = p_country    "+
		"	   AND COLUMN = p_column    "+
		"	   AND CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE) <= CAST(p_year||'-'||p_month||'-01' AS DATE)    "+
		"	   GROUP BY SEQUENCE, METRIC_CODE    "+
		"    ) TMP   "+
		"    on CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE) = TMP.MAX_DATE "+
		"    and SEQUENCE = TMP.SEQUENCE_T "+
		"    and METRIC_CODE = TMP.METRIC_CODE_T "+
		"	AND COUNTRY_NAME = p_country      "+
		"	AND COLUMN = p_column     "+
		"	AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y'   "+
		"	AND USER_PROFILE = p_profile) "+
		") current  "+
		"left join "+
		"(select MAX(CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE)) AS MAX_DATE,  "+
		"second.SEQUENCE AS SEQUENCE_T, second.METRIC_CODE as METRIC_CODE_T   "+
		"from BHMS.V_BHMS_DEVELOPER_CHART_DATA first "+
		"join BHMS.V_BHMS_DEVELOPER_CHART_DATA second "+
		"on first.SEQUENCE = second.SEQUENCE "+
		"and first.METRIC_CODE = second.METRIC_CODE "+
		"and first.COUNTRY_NAME = second.COUNTRY_NAME "+
		"and first.COLUMN = second.COLUMN "+
		"and first.COUNTRY_NAME = p_country "+
		"and first.COLUMN = p_column "+
		"join "+
		"(SELECT DISTINCT MAX(CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE)) AS MAX_DATE,     "+
		"	 SEQUENCE,  METRIC_CODE "+
		"	 FROM BHMS.V_BHMS_DEVELOPER_CHART_DATA     "+
		"	 WHERE COUNTRY_NAME = p_country    "+
		"	 AND COLUMN = p_column    "+
		"	 AND CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE) <= CAST(p_year||'-'||p_month||'-01' AS DATE)    "+
		"	 GROUP BY SEQUENCE, METRIC_CODE    "+
		") TMP   "+
		"on CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE) = TMP.MAX_DATE  "+
		"and second.SEQUENCE = TMP.SEQUENCE "+
		"and second.METRIC_CODE = TMP.METRIC_CODE "+
		"and CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE) <=  "+
		"	 case when second.DATA_PERIOD_TYPE = 'MONTHLY' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 MONTH    "+
		"	 when second.DATA_PERIOD_TYPE = 'QUARTERLY' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 3 MONTHS    "+
		"	 when second.DATA_PERIOD_TYPE = 'ANNUAL' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 YEAR    "+
		"	 when second.DATA_PERIOD_TYPE = 'SEMI_ANNUAL' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 6 MONTHS    "+
		"	 when second.DATA_PERIOD_TYPE = 'WEEKLY' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 7 DAYS    "+
		"	 else CAST('1900-1-1' AS DATE) end "+
		"group by second.SEQUENCE, second.METRIC_CODE "+
		") join_table "+
		"on current.SEQUENCE = join_table.SEQUENCE_T "+
		"and current.METRIC_CODE = join_table.METRIC_CODE_T "+
		"left join "+
		"(select distinct SEQUENCE,METRIC_CODE,YEAR,MONTH,RATING, RANKING, COMPANY, TYPE  "+
		" from BHMS.V_BHMS_DEVELOPER_CHART_DATA    "+
		" where COUNTRY_NAME = p_country AND COLUMN = p_column "+
		") previous  "+
		"on join_table.SEQUENCE_T = previous.SEQUENCE    "+
		"and join_table.METRIC_CODE_T = previous.METRIC_CODE    "+
		"and previous.COMPANY = current.COMPANY "+
		"and previous.TYPE = current.TYPE "+
		"and CAST(trim(previous.YEAR)||'-'||trim(previous.MONTH)||'-01' AS DATE) = join_table.MAX_DATE    "+
		"ORDER BY COLUMN, SEQUENCE, COMPANY, RANKING ";

function getDeveloperCurrent(country, column, profile) {
	var developerCurrentSql = developerCurrent.replace(/p_country/g, quoteWrap(country));
	developerCurrentSql = developerCurrentSql.replace(/p_column/g, column);
	developerCurrentSql = developerCurrentSql.replace(/p_profile/g, quoteWrap(profile));
	var mapping = ["COLUMN", "SEQUENCE", "METRIC_CODE", "COMPANY", "RATING", "RANKING", "RANKING_DISPLAY", "SAMPLE_SIZE_MESSAGE", 
	               "TYPE", "OVERALL_SUM", "DATA_PERIOD_TYPE", "DISPLAY_NAME","ICON_TEXT", "P_RATING", "P_RANKING", "YEAR", "MONTH", "QUARTER", 
	               "PAGE_CHART_TYPE", "NUMERIC_FORMAT", "URL", "USER", "PW", "URL_TYPE"];
	return executeSql(developerCurrentSql, mapping);
}

function getDeveloperByMonth(country, column, year, month, profile) {
	var developerByMonthSql = developerByMonth.replace(/p_country/g, quoteWrap(country));
	developerByMonthSql = developerByMonthSql.replace(/p_column/g, column);
	developerByMonthSql = developerByMonthSql.replace(/p_year/g, quoteWrap(year));
	developerByMonthSql = developerByMonthSql.replace(/p_month/g, quoteWrap(month));
	developerByMonthSql = developerByMonthSql.replace(/p_profile/g, quoteWrap(profile));
	var mapping = ["COLUMN", "SEQUENCE", "METRIC_CODE", "COMPANY", "RATING", "RANKING", "RANKING_DISPLAY", "SAMPLE_SIZE_MESSAGE", 
	               "TYPE", "OVERALL_SUM", "DATA_PERIOD_TYPE", "DISPLAY_NAME", "ICON_TEXT", "P_RATING", "P_RANKING", "YEAR", "MONTH", "QUARTER", 
	               "PAGE_CHART_TYPE", "NUMERIC_FORMAT", "URL", "USER", "PW", "URL_TYPE"];
	return executeSql(developerByMonthSql, mapping);
}

var developerTableChart = "SELECT current.COLUMN, current.SEQUENCE, current.METRIC_CODE, " +
		"current.COMPANY, current.RATING, current.RANKING, current.RANKING_DISPLAY, current.DISPLAY_COLOR, " +
		"current.DISPLAY_NAME, current.DATA_PERIOD_TYPE, current.SAMPLE_SIZE_MESSAGE, " +
		"current.YEAR, current.MONTH, current.QUARTER, current.TYPE, " +
		"current.VALUE, current.PY_VALUE, current.VALUE_DIFF, " +
		"current.VALUE_PCT, current.START_DATE, current.PY_START_DATE, " +
		"previous.RATING as P_RATING, previous.RANKING as P_RANKING, " + 
		"current.VALUE_NUMERIC_FORMAT, current.PY_VALUE_NUMERIC_FORMAT, " +
		"current.VALUE_PCT_NUMERIC_FORMAT, CURRENT.ICON_TEXT, " + addDetailUrlField +
		"FROM " +
		"(select DISTINCT COLUMN, SEQUENCE, METRIC_CODE, COMPANY, RATING, RANKING, RANKING_DISPLAY, DISPLAY_COLOR, "+
		"   DISPLAY_NAME, DATA_PERIOD_TYPE, SAMPLE_SIZE_MESSAGE, " +
		"   YEAR, MONTH, QUARTER, TYPE, " +
		"   VALUE, PY_VALUE, VALUE_DIFF, VALUE_PCT, START_DATE, PY_START_DATE, " +
		"   VALUE_NUMERIC_FORMAT, PY_VALUE_NUMERIC_FORMAT, VALUE_PCT_NUMERIC_FORMAT, ICON_TEXT, " + addDetailUrlField +
		"	from BHMS.V_BHMS_DEVELOPER_LIST_DATA     "+
		"	WHERE CURRENT = 'Y'  "+
		"	AND COUNTRY_NAME = p_country "+
		"   AND COLUMN = p_column " + 
		"	AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y'   "+
		"	AND USER_PROFILE = p_profile) "+
		") current "+
		"left join( "+
		"select MAX(CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE)) AS MAX_DATE,  "+
		"second.SEQUENCE AS SEQUENCE_T, second.METRIC_CODE as METRIC_CODE_T   "+
		"from BHMS.V_BHMS_DEVELOPER_LIST_DATA first "+
		"join BHMS.V_BHMS_DEVELOPER_LIST_DATA second "+
		"on first.SEQUENCE = second.SEQUENCE "+
		"and first.METRIC_CODE = second.METRIC_CODE "+
		"and first.COUNTRY_NAME = second.COUNTRY_NAME "+
		"and first.COLUMN = second.COLUMN " +
		"and first.COUNTRY_NAME = p_country "+
		"and first.COLUMN = p_column " + 
		"and second.CURRENT = 'Y'  "+
		"and CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE) <=  " +
		" 	 case when second.DATA_PERIOD_TYPE = 'MONTHLY' then       " +
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 MONTH       "+
		" 	 when second.DATA_PERIOD_TYPE = 'QUARTERLY' then       "+
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 3 MONTHS       "+
		" 	 when second.DATA_PERIOD_TYPE = 'ANNUAL' then       "+
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 YEAR       "+
		" 	 when second.DATA_PERIOD_TYPE = 'SEMI_ANNUAL' then       "+
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 6 MONTHS       "+
		" 	 when second.DATA_PERIOD_TYPE = 'WEEKLY' then       "+
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 7 DAYS       "+
		" 	 else CAST('1900-1-1' AS DATE) end "+
		"group by second.SEQUENCE, second.METRIC_CODE "+
		") join_table "+
		"on current.SEQUENCE = join_table.SEQUENCE_T  "+
		"and current.METRIC_CODE = join_table.METRIC_CODE_T  "+
		"left join "+
		"(select distinct SEQUENCE,METRIC_CODE,YEAR,MONTH, RATING,  "+
		"   RANKING, COMPANY, TYPE " +
		"	from BHMS.V_BHMS_DEVELOPER_LIST_DATA  "+
		"	where COUNTRY_NAME = p_country  "+
		"   and COLUMN = p_column " +
		") previous  "+
		"on join_table.SEQUENCE_T = previous.SEQUENCE   "+
		"and join_table.METRIC_CODE_T = previous.METRIC_CODE  "+
		"and previous.COMPANY = current.COMPANY "+
		"and previous.TYPE = current.TYPE "+
		"and CAST(trim(previous.YEAR)||'-'||trim(previous.MONTH)||'-01' AS DATE) = join_table.MAX_DATE   "+
		"ORDER BY COLUMN, SEQUENCE";

var developerTableChartByMonth = "SELECT current.COLUMN, current.SEQUENCE, current.METRIC_CODE, " +
		"current.COMPANY, current.RATING, current.RANKING, current.RANKING_DISPLAY, current.DISPLAY_COLOR, " +
		"current.DISPLAY_NAME, current.DATA_PERIOD_TYPE, current.SAMPLE_SIZE_MESSAGE, " +
		"current.YEAR, current.MONTH, current.QUARTER, current.TYPE, " +
		"current.VALUE, current.PY_VALUE, current.VALUE_DIFF, " +
		"current.VALUE_PCT, current.START_DATE, current.PY_START_DATE, " +
		"previous.RATING as P_RATING, previous.RANKING as P_RANKING, " + 
		"current.VALUE_NUMERIC_FORMAT, current.PY_VALUE_NUMERIC_FORMAT, " +
		"current.VALUE_PCT_NUMERIC_FORMAT, CURRENT.ICON_TEXT, " + addDetailUrlField +
		"FROM " +
		"(select DISTINCT COLUMN, SEQUENCE, METRIC_CODE, COMPANY, RATING, RANKING, RANKING_DISPLAY, DISPLAY_COLOR, "+
		"   DISPLAY_NAME, DATA_PERIOD_TYPE, SAMPLE_SIZE_MESSAGE, " +
		"   YEAR, MONTH, QUARTER, TYPE, " +
		"   VALUE, PY_VALUE, VALUE_DIFF, VALUE_PCT, START_DATE, PY_START_DATE, " +
		"   VALUE_NUMERIC_FORMAT, PY_VALUE_NUMERIC_FORMAT, VALUE_PCT_NUMERIC_FORMAT, ICON_TEXT, " + addDetailUrlField +
		"	from BHMS.V_BHMS_DEVELOPER_LIST_DATA     "+
		"   join "+
		"   (SELECT DISTINCT MAX(CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE)) AS MAX_DATE,     "+
		"	   SEQUENCE as SEQUENCE_T,  METRIC_CODE as METRIC_CODE_T "+
		"	   FROM BHMS.V_BHMS_DEVELOPER_LIST_DATA     "+
		"	   WHERE COUNTRY_NAME = p_country    "+
		"	   AND COLUMN = p_column    "+
		"	   AND CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE) <= CAST(p_year||'-'||p_month||'-01' AS DATE)    "+
		"	   GROUP BY SEQUENCE, METRIC_CODE    "+
		"    ) TMP   "+
		"    on CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE) = TMP.MAX_DATE "+
		"    and SEQUENCE = TMP.SEQUENCE_T "+
		"    and METRIC_CODE = TMP.METRIC_CODE_T "+
		"	AND COUNTRY_NAME = p_country       "+
		"	AND COLUMN = p_column     "+
		"	AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y'   "+
		"	AND USER_PROFILE = p_profile) "+
		") current  "+
		"left join "+
		"(select MAX(CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE)) AS MAX_DATE,  " +
		"second.SEQUENCE AS SEQUENCE_T, second.METRIC_CODE as METRIC_CODE_T   " +
		"from BHMS.V_BHMS_DEVELOPER_LIST_DATA first " +
		"join BHMS.V_BHMS_DEVELOPER_LIST_DATA second " +
		"on first.SEQUENCE = second.SEQUENCE " +
		"and first.METRIC_CODE = second.METRIC_CODE " +
		"and first.COUNTRY_NAME = second.COUNTRY_NAME " +
		"and first.COLUMN = second.COLUMN " +
		"and first.COUNTRY_NAME = p_country " +
		"and first.COLUMN = p_column " +
		"join "+
		"(SELECT DISTINCT MAX(CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE)) AS MAX_DATE,     " +
		"	 SEQUENCE,  METRIC_CODE "+
		"	 FROM BHMS.V_BHMS_DEVELOPER_LIST_DATA     " +
		"	 WHERE COUNTRY_NAME = p_country    " +
		"	 AND COLUMN = p_column    " +
		"	 AND CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE) <= CAST(p_year||'-'||p_month||'-01' AS DATE)    " +
		"	 GROUP BY SEQUENCE, METRIC_CODE    "+
		") TMP   "+
		"on CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE) = TMP.MAX_DATE  "+
		"and second.SEQUENCE = TMP.SEQUENCE "+
		"and second.METRIC_CODE = TMP.METRIC_CODE "+
		"and CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE) <=  "+
		"	 case when second.DATA_PERIOD_TYPE = 'MONTHLY' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 MONTH    "+
		"	 when second.DATA_PERIOD_TYPE = 'QUARTERLY' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 3 MONTHS    "+
		"	 when second.DATA_PERIOD_TYPE = 'ANNUAL' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 YEAR    "+
		"	 when second.DATA_PERIOD_TYPE = 'SEMI_ANNUAL' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 6 MONTHS    "+
		"	 when second.DATA_PERIOD_TYPE = 'WEEKLY' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 7 DAYS    "+
		"	 else CAST('1900-1-1' AS DATE) end "+
		"group by second.SEQUENCE, second.METRIC_CODE "+
		") join_table "+
		"on current.SEQUENCE = join_table.SEQUENCE_T "+
		"and current.METRIC_CODE = join_table.METRIC_CODE_T "+
		"left join "+
		"(select distinct SEQUENCE,METRIC_CODE,YEAR,MONTH, RATING,  "+
		"   RANKING, COMPANY, TYPE " +
		"	from BHMS.V_BHMS_DEVELOPER_LIST_DATA  "+
		"	where COUNTRY_NAME = p_country  "+
		"   and COLUMN = p_column " +
		") previous  "+
		"on join_table.SEQUENCE_T = previous.SEQUENCE   "+
		"and join_table.METRIC_CODE_T = previous.METRIC_CODE  "+
		"and previous.COMPANY = current.COMPANY "+
		"and previous.TYPE = current.TYPE "+
		"and CAST(trim(previous.YEAR)||'-'||trim(previous.MONTH)||'-01' AS DATE) = join_table.MAX_DATE   "+
		"ORDER BY COLUMN, SEQUENCE";

function getDeveloperTableChart(country, column, profile) {
	var developerTableChartSql = developerTableChart.replace(/p_country/g, quoteWrap(country));
	developerTableChartSql = developerTableChartSql.replace(/p_column/g, column);
	developerTableChartSql = developerTableChartSql.replace(/p_profile/g, quoteWrap(profile));
	var mapping = ["COLUMN", "SEQUENCE", "METRIC_CODE",  
	       		"COMPANY", "RATING", "RANKING", "RANKING_DISPLAY", "DISPLAY_COLOR",
	    		"DISPLAY_NAME", "DATA_PERIOD_TYPE", "SAMPLE_SIZE_MESSAGE",  
	    		"YEAR", "MONTH", "QUARTER", "TYPE",  
	    		"VALUE", "PY_VALUE", "VALUE_DIFF",  
	    		"VALUE_PCT", "START_DATE", "PY_START_DATE",  
	    		"P_RATING", "P_RANKING",   
	    		"VALUE_NUMERIC_FORMAT", "PY_VALUE_NUMERIC_FORMAT",  
	    		"VALUE_PCT_NUMERIC_FORMAT", "ICON_TEXT",  "URL", "USER", "PW", "URL_TYPE"];
	return executeSql(developerTableChartSql, mapping);
}

function getDeveloperTableChartByMonth(country, column, year, month, profile) {
	var developerTableChartByMonthSql = developerTableChartByMonth.replace(/p_country/g, quoteWrap(country));
	developerTableChartByMonthSql = developerTableChartByMonthSql.replace(/p_column/g, column);
	developerTableChartByMonthSql = developerTableChartByMonthSql.replace(/p_year/g, quoteWrap(year));
	developerTableChartByMonthSql = developerTableChartByMonthSql.replace(/p_month/g, quoteWrap(month));
	developerTableChartByMonthSql = developerTableChartByMonthSql.replace(/p_profile/g, quoteWrap(profile));
	var mapping = ["COLUMN", "SEQUENCE", "METRIC_CODE",  
		       		"COMPANY", "RATING", "RANKING", "RANKING_DISPLAY", "DISPLAY_COLOR",
		    		"DISPLAY_NAME", "DATA_PERIOD_TYPE", "SAMPLE_SIZE_MESSAGE",  
		    		"YEAR", "MONTH", "QUARTER", "TYPE",  
		    		"VALUE", "PY_VALUE", "VALUE_DIFF",  
		    		"VALUE_PCT", "START_DATE", "PY_START_DATE",  
		    		"P_RATING", "P_RANKING",   
		    		"VALUE_NUMERIC_FORMAT", "PY_VALUE_NUMERIC_FORMAT",  
		    		"VALUE_PCT_NUMERIC_FORMAT", "ICON_TEXT",   "URL", "USER", "PW", "URL_TYPE"];
	return executeSql(developerTableChartByMonthSql, mapping);
}

var employeeCurrentStatement = WL.Server.createSQLStatement(
		"SELECT	CONSTITUENTS, COLUMN, SEQUENCE, METRIC_CODE, DISPLAY_NAME, YEAR, COLOR_CODE, ICON_TEXT " +
		"FROM BHMS.V_BHMS_EMPLOYEE_LIST_DATA " +
		"WHERE COUNTRY_NAME = ? AND CURRENT = 'Y' " +
		"and metric_code in (select distinct metric_code from bhms_profile_metric_security where active = 'Y' and user_profile = ?) " +
		"ORDER BY CONSTITUENTS, COLUMN, SEQUENCE");

var employeeByYearStatement = WL.Server.createSQLStatement(
		"SELECT	CONSTITUENTS, COLUMN, SEQUENCE, METRIC_CODE, DISPLAY_NAME, YEAR, COLOR_CODE, ICON_TEXT " +
		"FROM BHMS.V_BHMS_EMPLOYEE_LIST_DATA  , (SELECT MAX(TO_NUMBER(TRIM(YEAR))) AS MAX_DATE, COLUMN AS COLUMN_T, SEQUENCE AS SEQUENCE_T, CONSTITUENTS AS CONSTITUENTS_T " +
		"FROM BHMS.V_BHMS_EMPLOYEE_LIST_DATA  " +
		"WHERE COUNTRY_NAME = ? " +
		"AND TO_NUMBER(TRIM(YEAR)) <= TO_NUMBER(?)  " +
		"GROUP BY CONSTITUENTS, COLUMN, SEQUENCE) TMP  " +
		"WHERE COUNTRY_NAME = ? " +
		"AND TO_NUMBER(TRIM(YEAR))= TMP.MAX_DATE " +
		"AND COLUMN = TMP.COLUMN_T " +
		"AND SEQUENCE = TMP.SEQUENCE_T " +
		"AND CONSTITUENTS = TMP.CONSTITUENTS_T " +
		"AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y' AND USER_PROFILE = ?) " +
		"ORDER BY CONSTITUENTS, COLUMN, SEQUENCE");

function getEmployeeCurrent(param) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : employeeCurrentStatement,
		parameters : param
	});
}

function getEmployeeByYear(counrty, year, profile) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : employeeByYearStatement,
		parameters : [counrty, year, counrty, profile]
	});
}

var cpCurrent = "SELECT CASE WHEN current.column = 1 THEN 'Belief' WHEN current.column = 2 THEN 'Action'  "+
		"WHEN current.column = 3 THEN 'Advocacy' ELSE 'Other' END as KEY, " + 
		"CASE WHEN current.COLUMN = 1 AND current.SEQUENCE = 1 THEN 'brand' "+
		"WHEN current.COLUMN = 1 AND current.SEQUENCE = 2 THEN 'mentions' "+
		"WHEN current.COLUMN = 1 AND current.SEQUENCE = 3 THEN 'provider' " +
		"WHEN current.COLUMN = 1 AND current.SEQUENCE = 4 THEN 'sentiment' " +
		"WHEN current.COLUMN = 1 AND current.SEQUENCE = 5 THEN 'relevance' " +
		"WHEN current.COLUMN = 1 AND current.SEQUENCE = 6 THEN 'optimize' " +
		"WHEN current.COLUMN = 2 AND current.SEQUENCE = 2 THEN 'marketshare' " +
		"WHEN current.COLUMN = 2 AND current.SEQUENCE = 3 THEN 'preference' " +
		"WHEN current.COLUMN = 2 AND current.SEQUENCE = 4 THEN 'engagement' " + 
		"WHEN current.COLUMN = 2 AND current.SEQUENCE = 5 THEN 'proposal' " +
		"WHEN current.COLUMN = 3 AND current.SEQUENCE = 1 THEN 'recommended' " + 
		"WHEN current.COLUMN = 3 AND current.SEQUENCE = 7 THEN 'socialsentiment' " +
		"WHEN current.COLUMN = 3 AND current.SEQUENCE = 3 THEN 'traditionalmedia' " +
		"WHEN current.COLUMN = 3 AND current.SEQUENCE = 4 THEN 'likelihood' " +
		"WHEN current.COLUMN = 3 AND current.SEQUENCE = 8 THEN 'socialshare' " +
		"WHEN current.COLUMN = 3 AND current.SEQUENCE = 6 THEN 'mediashare' " + 
		"ELSE CAST(current.SEQUENCE as CHAR(2)) END as SEQUENCE, " +
		"CASE WHEN current.COMPANY = 'IBM' THEN 1 ELSE 2 END as SEQUENCE3, " + 
		"current.SEQUENCE as SEQUENCE2, current.VALUE, current.COMPANY, current.DISPLAY_NAME, " +
		"current.ANALYTICS_SUM, current.COGNITIVE_SUM, current.CLOUD_SUM, current.MOBILE_SUM, " +
		"current.SOCIAL_SUM, current.SECURITY_SUM, current.IT_SUM, " +
		"current.LOB_SUM, current.CLIENT_SUM, current.PROSPECT_SUM, " +
		"current.ANALYTICS_RANKING, current.ANALYTICS_RATING, current.COGNITIVE_RANKING, current.COGNITIVE_RATING, current.CLOUD_RANKING, " +
		"current.CLOUD_RATING, current.MOBILE_RANKING, current.MOBILE_RATING, " +
		"current.SOCIAL_RANKING, current.SOCIAL_RATING, current.SECURITY_RANKING, current.SECURITY_RATING, " + 
		"current.LOB_RANKING, current.LOB_RATING, current.IT_RANKING, current.IT_RATING, " +
		"current.CLIENT_RANKING, current.CLIENT_RATING, current.PROSPECT_RANKING, current.PROSPECT_RATING, " + 
		"current.RANKING, current.RANKING_DISPLAY, current.RATING, current.DATA_PERIOD_TYPE,  " +
		"current.SAMPLE_SIZE_MESSAGE, current.SAMPLE_SIZE_ANALYTICS, current.SAMPLE_SIZE_COGNITIVE, current.SAMPLE_SIZE_CLOUD, " +
		"current.SAMPLE_SIZE_MOBILE, current.SAMPLE_SIZE_SOCIAL, current.SAMPLE_SIZE_SECURITY, " +
		"current.SAMPLE_SIZE_LOB, current.SAMPLE_SIZE_IT, current.SAMPLE_SIZE_CLIENT, current.SAMPLE_SIZE_PROSPECT, " +
		"previous.RATING as P_RATING, previous.ANALYTICS_RATING as P_ANALYTICS_RATING, " +
		"previous.COGNITIVE_RATING as P_COGNITIVE_RATING, previous.CLOUD_RATING as P_CLOUD_RATING, previous.MOBILE_RATING as P_MOBILE_RATING, " + 
		"previous.SOCIAL_RATING as P_SOCIAL_RATING, previous.SECURITY_RATING as P_SECURITY_RATING, previous.LOB_RATING as P_LOB_RATING, " +
		"previous.IT_RATING as P_IT_RATING, previous.CLIENT_RATING as P_CLIENT_RATING, previous.PROSPECT_RATING as P_PROSPECT_RATING, " + 
		"previous.RANKING as P_RANKING, previous.ANALYTICS_RANKING as P_ANALYTICS_RANKING, previous.COGNITIVE_RANKING as P_COGNITIVE_RANKING, previous.CLOUD_RANKING as P_CLOUD_RANKING, " +
		"previous.MOBILE_RANKING as P_MOBILE_RANKING, previous.SOCIAL_RANKING as P_SOCIAL_RANKING, previous.SECURITY_RANKING as P_SECURITY_RANKING, " + 
		"previous.LOB_RANKING as P_LOB_RANKING, previous.IT_RANKING as P_IT_RANKING, " +
		"previous.CLIENT_RANKING as P_CLIENT_RANKING, previous.PROSPECT_RANKING as P_PROSPECT_RANKING, " +
		"current.YEAR, current.MONTH, current.QUARTER, current.TYPE, " + 
		"current.NUMERIC_FORMAT, current.CAMS_DISPLAY_NAME, CURRENT.ICON_TEXT, CURRENT.CAMS_ICON_TEXT, " + addDetailUrlField +
		"from "+
		"(select DISTINCT COLUMN, SEQUENCE, METRIC_CODE, COMPANY, VALUE, DISPLAY_NAME, ANALYTICS_SUM,   "+
		"	COGNITIVE_SUM, CLOUD_SUM, MOBILE_SUM, SOCIAL_SUM, SECURITY_SUM,   "+
		"	IT_SUM, LOB_SUM, CLIENT_SUM, PROSPECT_SUM, ANALYTICS_RANKING, ANALYTICS_RATING, COGNITIVE_RANKING, COGNITIVE_RATING, CLOUD_RANKING, " +
		"   CLOUD_RATING, MOBILE_RANKING, MOBILE_RATING, " +
		"   SOCIAL_RANKING, SOCIAL_RATING, SECURITY_RANKING, " +
		"   SECURITY_RATING, LOB_RANKING, LOB_RATING, " +
		"   IT_RANKING, IT_RATING, CLIENT_RANKING, " +
		"   CLIENT_RATING, PROSPECT_RANKING, PROSPECT_RATING, " +
		"   RANKING, RANKING_DISPLAY, RATING, " +
		"   DATA_PERIOD_TYPE, SAMPLE_SIZE_MESSAGE, SAMPLE_SIZE_ANALYTICS, SAMPLE_SIZE_COGNITIVE, SAMPLE_SIZE_CLOUD, " +
		"   SAMPLE_SIZE_MOBILE, SAMPLE_SIZE_SOCIAL, SAMPLE_SIZE_SECURITY, SAMPLE_SIZE_LOB, " +
		"   SAMPLE_SIZE_IT, SAMPLE_SIZE_CLIENT, SAMPLE_SIZE_PROSPECT, YEAR, " +
		"   MONTH, QUARTER, TYPE, " +
		"   NUMERIC_FORMAT, CAMS_DISPLAY_NAME, ICON_TEXT, CAMS_ICON_TEXT, " + addDetailUrlField +
		"	from BHMS.V_BHMS_CP_CHART_DATA     "+
		"	WHERE  CURRENT = 'Y'     "+
		"	AND COUNTRY_NAME = p_country     "+
		"	AND COLUMN = p_column   "+
		"	AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y'   "+
		"	AND USER_PROFILE = p_profile) "+
		") current "+
		"left join( "+
		"select MAX(CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE)) AS MAX_DATE,  "+
		"second.SEQUENCE AS SEQUENCE_T, second.METRIC_CODE as METRIC_CODE_T   "+
		"from BHMS.V_BHMS_CP_CHART_DATA first "+
		"join BHMS.V_BHMS_CP_CHART_DATA second "+
		"on first.SEQUENCE = second.SEQUENCE "+
		"and first.METRIC_CODE = second.METRIC_CODE "+
		"and first.COUNTRY_NAME = second.COUNTRY_NAME "+
		"and first.COLUMN = second.COLUMN "+
		"and first.COUNTRY_NAME = p_country "+
		"and first.COLUMN = p_column "+
		"and second.CURRENT = 'Y'  "+
		"and CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE) <=  "+
		" 	 case when second.DATA_PERIOD_TYPE = 'MONTHLY' then       "+
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 MONTH       "+
		" 	 when second.DATA_PERIOD_TYPE = 'QUARTERLY' then       "+
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 3 MONTHS       "+
		" 	 when second.DATA_PERIOD_TYPE = 'ANNUAL' then       "+
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 YEAR       "+
		" 	 when second.DATA_PERIOD_TYPE = 'SEMI_ANNUAL' then       "+
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 6 MONTHS       "+
		" 	 when second.DATA_PERIOD_TYPE = 'WEEKLY' then       "+
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 7 DAYS       "+
		" 	 else CAST('1900-1-1' AS DATE) end  "+
		"group by second.SEQUENCE, second.METRIC_CODE "+
		") join_table "+
		"on current.SEQUENCE = join_table.SEQUENCE_T  "+
		"and current.METRIC_CODE = join_table.METRIC_CODE_T  "+
		"left join "+
		"(select distinct SEQUENCE,METRIC_CODE,YEAR,MONTH,RATING, ANALYTICS_RATING, COGNITIVE_RATING, CLOUD_RATING, MOBILE_RATING, "+
		"   SOCIAL_RATING, SECURITY_RATING, LOB_RATING, " +
		"   IT_RATING, CLIENT_RATING, PROSPECT_RATING, " + 
		"   RANKING, ANALYTICS_RANKING, COGNITIVE_RANKING, CLOUD_RANKING, " +
		"   MOBILE_RANKING, SOCIAL_RANKING, SECURITY_RANKING, " + 
		"   LOB_RANKING, IT_RANKING, CLIENT_RANKING, PROSPECT_RANKING, COMPANY, TYPE " +
		"	from BHMS.V_BHMS_CP_CHART_DATA  "+
		"	where COUNTRY_NAME = p_country AND COLUMN = p_column  "+
		") previous  "+
		"on join_table.SEQUENCE_T = previous.SEQUENCE   "+
		"and join_table.METRIC_CODE_T = previous.METRIC_CODE  "+
		"and previous.COMPANY = current.COMPANY "+
		"and previous.TYPE = current.TYPE "+
		"and CAST(trim(previous.YEAR)||'-'||trim(previous.MONTH)||'-01' AS DATE) = join_table.MAX_DATE   "+
		"ORDER BY KEY, SEQUENCE2, SEQUENCE3, RANKING";

var cpByMonth = "SELECT CASE WHEN current.column = 1 THEN 'Belief' WHEN current.column = 2 THEN 'Action'  "+
		"WHEN current.column = 3 THEN 'Advocacy' ELSE 'Other' END as KEY, " + 
		"CASE WHEN current.COLUMN = 1 AND current.SEQUENCE = 1 THEN 'brand' "+
		"WHEN current.COLUMN = 1 AND current.SEQUENCE = 2 THEN 'mentions' "+
		"WHEN current.COLUMN = 1 AND current.SEQUENCE = 3 THEN 'provider' " +
		"WHEN current.COLUMN = 1 AND current.SEQUENCE = 4 THEN 'sentiment' " +
		"WHEN current.COLUMN = 1 AND current.SEQUENCE = 5 THEN 'relevance' " +
		"WHEN current.COLUMN = 1 AND current.SEQUENCE = 6 THEN 'optimize' " +
		"WHEN current.COLUMN = 2 AND current.SEQUENCE = 2 THEN 'marketshare' " +
		"WHEN current.COLUMN = 2 AND current.SEQUENCE = 3 THEN 'preference' " +
		"WHEN current.COLUMN = 2 AND current.SEQUENCE = 4 THEN 'engagement' " + 
		"WHEN current.COLUMN = 2 AND current.SEQUENCE = 5 THEN 'proposal' " +
		"WHEN current.COLUMN = 3 AND current.SEQUENCE = 1 THEN 'recommended' " + 
		"WHEN current.COLUMN = 3 AND current.SEQUENCE = 7 THEN 'socialsentiment' " +
		"WHEN current.COLUMN = 3 AND current.SEQUENCE = 3 THEN 'traditionalmedia' " +
		"WHEN current.COLUMN = 3 AND current.SEQUENCE = 4 THEN 'likelihood' " +
		"WHEN current.COLUMN = 3 AND current.SEQUENCE = 8 THEN 'socialshare' " +
		"WHEN current.COLUMN = 3 AND current.SEQUENCE = 6 THEN 'mediashare' " + 
		"ELSE CAST(current.SEQUENCE as CHAR(2)) END as SEQUENCE, " +
		"CASE WHEN current.COMPANY = 'IBM' THEN 1 ELSE 2 END as SEQUENCE3, " + 
		"current.SEQUENCE as SEQUENCE2, current.VALUE, current.COMPANY, current.DISPLAY_NAME, " +
		"current.ANALYTICS_SUM, current.COGNITIVE_SUM, current.CLOUD_SUM, current.MOBILE_SUM, " +
		"current.SOCIAL_SUM, current.SECURITY_SUM, current.IT_SUM, " +
		"current.LOB_SUM, current.CLIENT_SUM, current.PROSPECT_SUM, " +
		"current.ANALYTICS_RANKING, current.ANALYTICS_RATING, current.COGNITIVE_RANKING, current.COGNITIVE_RATING, current.CLOUD_RANKING, " +
		"current.CLOUD_RATING, current.MOBILE_RANKING, current.MOBILE_RATING, " +
		"current.SOCIAL_RANKING, current.SOCIAL_RATING, current.SECURITY_RANKING, current.SECURITY_RATING, " + 
		"current.LOB_RANKING, current.LOB_RATING, current.IT_RANKING, current.IT_RATING, " +
		"current.CLIENT_RANKING, current.CLIENT_RATING, current.PROSPECT_RANKING, current.PROSPECT_RATING, " + 
		"current.RANKING, current.RANKING_DISPLAY, current.RATING, current.DATA_PERIOD_TYPE,  " +
		"current.SAMPLE_SIZE_MESSAGE, current.SAMPLE_SIZE_ANALYTICS, current.SAMPLE_SIZE_COGNITIVE, current.SAMPLE_SIZE_CLOUD, " +
		"current.SAMPLE_SIZE_MOBILE, current.SAMPLE_SIZE_SOCIAL, current.SAMPLE_SIZE_SECURITY, " +
		"current.SAMPLE_SIZE_LOB, current.SAMPLE_SIZE_IT, current.SAMPLE_SIZE_CLIENT, current.SAMPLE_SIZE_PROSPECT, " +
		"previous.RATING as P_RATING, previous.ANALYTICS_RATING as P_ANALYTICS_RATING, " +
		"previous.COGNITIVE_RATING as P_COGNITIVE_RATING, previous.CLOUD_RATING as P_CLOUD_RATING, previous.MOBILE_RATING as P_MOBILE_RATING, " + 
		"previous.SOCIAL_RATING as P_SOCIAL_RATING, previous.SECURITY_RATING as P_SECURITY_RATING, previous.LOB_RATING as P_LOB_RATING, " +
		"previous.IT_RATING as P_IT_RATING, previous.CLIENT_RATING as P_CLIENT_RATING, previous.PROSPECT_RATING as P_PROSPECT_RATING, " + 
		"previous.RANKING as P_RANKING, previous.ANALYTICS_RANKING as P_ANALYTICS_RANKING, previous.COGNITIVE_RANKING as P_COGNITIVE_RANKING, previous.CLOUD_RANKING as P_CLOUD_RANKING, " +
		"previous.MOBILE_RANKING as P_MOBILE_RANKING, previous.SOCIAL_RANKING as P_SOCIAL_RANKING, previous.SECURITY_RANKING as P_SECURITY_RANKING, " + 
		"previous.LOB_RANKING as P_LOB_RANKING, previous.IT_RANKING as P_IT_RANKING, " +
		"previous.CLIENT_RANKING as P_CLIENT_RANKING, previous.PROSPECT_RANKING as P_PROSPECT_RANKING, " +
		"current.YEAR, current.MONTH, current.QUARTER, current.TYPE, " + 
		"current.NUMERIC_FORMAT, current.CAMS_DISPLAY_NAME, CURRENT.ICON_TEXT, CURRENT.CAMS_ICON_TEXT, " + addDetailUrlField +
		"from "+
		"(select DISTINCT COLUMN, SEQUENCE, METRIC_CODE, COMPANY, VALUE, DISPLAY_NAME, ANALYTICS_SUM,   "+
		"	COGNITIVE_SUM, CLOUD_SUM, MOBILE_SUM, SOCIAL_SUM, SECURITY_SUM,   "+
		"	IT_SUM, LOB_SUM, CLIENT_SUM, PROSPECT_SUM, ANALYTICS_RANKING, ANALYTICS_RATING, COGNITIVE_RANKING, COGNITIVE_RATING, CLOUD_RANKING, " +
		"   CLOUD_RATING, MOBILE_RANKING, MOBILE_RATING, " +
		"   SOCIAL_RANKING, SOCIAL_RATING, SECURITY_RANKING, " +
		"   SECURITY_RATING, LOB_RANKING, LOB_RATING, " +
		"   IT_RANKING, IT_RATING, CLIENT_RANKING, " +
		"   CLIENT_RATING, PROSPECT_RANKING, PROSPECT_RATING, " +
		"   RANKING, RANKING_DISPLAY, RATING, " +
		"   DATA_PERIOD_TYPE, SAMPLE_SIZE_MESSAGE, SAMPLE_SIZE_ANALYTICS, SAMPLE_SIZE_COGNITIVE, SAMPLE_SIZE_CLOUD, " +
		"   SAMPLE_SIZE_MOBILE, SAMPLE_SIZE_SOCIAL, SAMPLE_SIZE_SECURITY, SAMPLE_SIZE_LOB, " +
		"   SAMPLE_SIZE_IT, SAMPLE_SIZE_CLIENT, SAMPLE_SIZE_PROSPECT, YEAR, " +
		"   MONTH, QUARTER, TYPE, " +
		"   NUMERIC_FORMAT, CAMS_DISPLAY_NAME, ICON_TEXT, CAMS_ICON_TEXT, " + addDetailUrlField +
		"	from BHMS.V_BHMS_CP_CHART_DATA     "+
		"   join "+
		"   (SELECT DISTINCT MAX(CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE)) AS MAX_DATE,     "+
		"	   SEQUENCE as SEQUENCE_T,  METRIC_CODE as METRIC_CODE_T "+
		"	   FROM BHMS.V_BHMS_CP_CHART_DATA     "+
		"	   WHERE COUNTRY_NAME = p_country    "+
		"	   AND COLUMN = p_column    "+
		"	   AND CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE) <= CAST(p_year||'-'||p_month||'-01' AS DATE)    "+
		"	   GROUP BY SEQUENCE, METRIC_CODE    "+
		"    ) TMP   "+
		"    on CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE) = TMP.MAX_DATE "+
		"    and SEQUENCE = TMP.SEQUENCE_T "+
		"    and METRIC_CODE = TMP.METRIC_CODE_T "+
		"	AND COUNTRY_NAME = p_country       "+
		"	AND COLUMN = p_column     "+
		"	AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y'   "+
		"	AND USER_PROFILE = p_profile) "+
		") current  "+
		"left join "+
		"(select MAX(CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE)) AS MAX_DATE,  "+
		"second.SEQUENCE AS SEQUENCE_T, second.METRIC_CODE as METRIC_CODE_T   "+
		"from BHMS.V_BHMS_CP_CHART_DATA first "+
		"join BHMS.V_BHMS_CP_CHART_DATA second "+
		"on first.SEQUENCE = second.SEQUENCE "+
		"and first.METRIC_CODE = second.METRIC_CODE "+
		"and first.COUNTRY_NAME = second.COUNTRY_NAME "+
		"and first.COLUMN = second.COLUMN "+
		"and first.COUNTRY_NAME = p_country "+
		"and first.COLUMN = p_column "+
		"join "+
		"(SELECT DISTINCT MAX(CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE)) AS MAX_DATE,     "+
		"	 SEQUENCE,  METRIC_CODE "+
		"	 FROM BHMS.V_BHMS_CP_CHART_DATA     "+
		"	 WHERE COUNTRY_NAME = p_country    "+
		"	 AND COLUMN = p_column    "+
		"	 AND CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE) <= CAST(p_year||'-'||p_month||'-01' AS DATE)    "+
		"	 GROUP BY SEQUENCE, METRIC_CODE    "+
		") TMP   "+
		"on CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE) = TMP.MAX_DATE  "+
		"and second.SEQUENCE = TMP.SEQUENCE "+
		"and second.METRIC_CODE = TMP.METRIC_CODE "+
		"and CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE) <=  "+
		"	 case when second.DATA_PERIOD_TYPE = 'MONTHLY' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 MONTH    "+
		"	 when second.DATA_PERIOD_TYPE = 'QUARTERLY' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 3 MONTHS    "+
		"	 when second.DATA_PERIOD_TYPE = 'ANNUAL' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 YEAR    "+
		"	 when second.DATA_PERIOD_TYPE = 'SEMI_ANNUAL' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 6 MONTHS    "+
		"	 when second.DATA_PERIOD_TYPE = 'WEEKLY' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 7 DAYS    "+
		"	 else CAST('1900-1-1' AS DATE) end "+
		"group by second.SEQUENCE, second.METRIC_CODE "+
		") join_table "+
		"on current.SEQUENCE = join_table.SEQUENCE_T "+
		"and current.METRIC_CODE = join_table.METRIC_CODE_T "+
		"left join "+
		"(select distinct SEQUENCE,METRIC_CODE,YEAR,MONTH,RATING, ANALYTICS_RATING, COGNITIVE_RATING, CLOUD_RATING, MOBILE_RATING, "+
		"   SOCIAL_RATING, SECURITY_RATING, LOB_RATING, " +
		"   IT_RATING, CLIENT_RATING, PROSPECT_RATING, " + 
		"   RANKING, ANALYTICS_RANKING, COGNITIVE_RANKING, CLOUD_RANKING, " +
		"   MOBILE_RANKING, SOCIAL_RANKING, SECURITY_RANKING, " + 
		"   LOB_RANKING, IT_RANKING, CLIENT_RANKING, PROSPECT_RANKING, COMPANY, TYPE " +
		"	from BHMS.V_BHMS_CP_CHART_DATA  "+
		"	where COUNTRY_NAME = p_country AND COLUMN = p_column  "+
		") previous  "+
		"on join_table.SEQUENCE_T = previous.SEQUENCE   "+
		"and join_table.METRIC_CODE_T = previous.METRIC_CODE  "+
		"and previous.COMPANY = current.COMPANY "+
		"and previous.TYPE = current.TYPE "+
		"and CAST(trim(previous.YEAR)||'-'||trim(previous.MONTH)||'-01' AS DATE) = join_table.MAX_DATE   "+
		"ORDER BY KEY, SEQUENCE2, SEQUENCE3, RANKING";

function _getPeriodText(period, month, year, week) {
	if (period == null) return "Invalid Period";
	
	var retval = "Invalid Data";
	
	if (period == "QUARTERLY") {
		var tmp = Math.floor((month - 1)/3) + 1
		
		if ((tmp < 1) || (tmp > 4)) {
			retval = "Invalid Month";
		} else {
			retval = tmp + "Q " + year;
		}
		
	} else if (period == "MONTHLY") {
		var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		
		if ((Number(month) >= 1) && (Number(month) <= 12)) {
			retval = months[month - 1] + " " + year;
		} else {
			retval = "Invalid Month";
		}
		
	} else if (period == "WEEKLY") {
		retval = "Week " + week + ", " + year;
		
	} else if (period == "SEMI_ANNUAL") {
		if ((Number(month) >= 1) && (Number(month) < 7)) {
			retval = "1H " + year;
		} else if ((Number(month) >= 7) && (Number(month) <= 12)) {
			retval = "2H " + year;
		} else {
			retval = "Invalid Half";
		}
		
	} else if (period == "ANNUAL") {
		retval = year;
	}
	
	return retval;
}

function _stackProcessor(key, object)
{
	object[key].values = object[key].data.reduce(function(previous, current){
		return current.positiveValue?previous.concat(current.positiveValue):previous;
	},[]);
	
	object[key].data = object[key].data.reduce(function(previous, current){
		for (var x = 0; x < previous.length; x++)
		{
			if (previous[x].name == current.name)
			{
				for (var y in current)
				{
					previous[x][y] = current[y];
				}
				return previous;
			}
		}
		
		return previous.concat(current);
	}, []);
	
}

function _percentValueLabelBuild(key, array)
{
	Object.keys(array[key].data[0]).map(function(currentIndex)
	{
		if (currentIndex.indexOf("value") > -1)
		{
			var total = array[key].data.reduce(function(prev, current) { return prev + current[currentIndex] }, 0);
			
			var suffix = currentIndex.substring(5);
			
			array[key].data.map(function(current) {
				current['yLabel' + suffix] = current[currentIndex];
				current[currentIndex] = parseInt(current[currentIndex] / total * 100);
			});
		}
		
		if (currentIndex.indexOf("negativeValue") > -1)
		{
			var suffix = currentIndex.substring(13);
			
			array[key].data.map(function(current) {
				var total = current["negativeValue" + suffix] + current["neutralValue" + suffix] + current["positiveValue" + suffix];
				current['yNegativeValue' + suffix] = current["negativeValue" + suffix];
				current['yNeutralValue' + suffix] = current["neutralValue" + suffix];
				current['yPositiveValue' + suffix] = current["positiveValue" + suffix];
				
				current["negativeValue" + suffix] = parseInt(current["negativeValue" + suffix] / total * 100);
				current["neutralValue" + suffix] = parseInt(current["neutralValue" + suffix] / total * 100);
				current["positiveValue" + suffix] = parseInt(current["positiveValue" + suffix] / total * 100);
				var currentSum = current["negativeValue" + suffix] + current["neutralValue" + suffix] + current["positiveValue" + suffix];
				if(currentSum != 100){
					current["neutralValue" + suffix] = current["neutralValue" + suffix] + (100 - currentSum);
				}
			});
		}
	});
	
	array[key].percentage = true;
}

function beSort(data) {
	var key = data.sortKey
	data[key].data.sort(function(a,b) { return (a.name == "IBM")?-1:(b.name == "IBM")?1:(a.rank < b.rank)?-1:1; });
	  
//	var names = data[key].data.map(function(item) { return item.name; });
//	
//	var chartKeys = Object.keys(data).filter(function(item) { return (item == "sortKey")?false:true; });
//	
//	//add any extra names to end
//	var subKeys = chartKeys.filter(function (item) { return item != key; });
//	subKeys.map(function(currentKey){
//	  data[currentKey].data.reduce(function(prev, current) { 
//	    if (prev.indexOf(current.name) == -1) prev.push(current.name);
//	    return prev;
//	  }, names)
//	});
//	
//	chartKeys.map(function(currentKey) {
//		var currentLength = data[currentKey].data.length; 
//		data[currentKey].data = names.map(function(item) { 
//	       var x = data[currentKey].data.filter(function(newkey) { return newkey.name == item; });
//	       
//	       if (x.length > 0) {
//	    	   return x[0];
//	       } else {
//	    	  var newItem = {};
//	    	  Object.keys(data[currentKey].data[0]).map(function (myKey) {
//	    		 if (myKey == "name") {
//	    			 newItem.name = item;
//	    		 } else if (myKey == "rank") {
//	    			 currentLength++;
//	    			 newItem.rank = currentLength;
//	    	     } else {
//	    			 newItem[myKey] = null;
//	    	     }
//	    	  });
//	    	  
//	    	  return newItem;
//	       }
//	    });
//	});
}

var trendStatement = WL.Server.createSQLStatement(
		"select distinct COUNTRY_NAME, COMPANY, CONSTITUENTS, COLUMN, SEQUENCE, CASE WHEN COMPANY = 'IBM' THEN 1 ELSE 2 END as SEQUENCE1, METRIC_CODE, IBMER, " +
		"DATA_PERIOD_TYPE, TYPE, YEAR, MONTH, QUARTER, DAY, START_DATE, " +
		"DISPLAY_NAME, CAMS_DISPLAY_NAME, NUMERIC_FORMAT, PAGE_CHART_TYPE, " +
		"VALUE, RATING, RANKING_DISPLAY," +
		"ANALYTICS_SUM, ANALYTICS_RATING, ANALYTICS_RANKING, " +
		"COGNITIVE_SUM, COGNITIVE_RATING, COGNITIVE_RANKING, " +
		"CLOUD_SUM, CLOUD_RATING, CLOUD_RANKING, " +
		"MOBILE_SUM, MOBILE_RATING, MOBILE_RANKING, " +
		"SOCIAL_SUM, SOCIAL_RATING, SOCIAL_RANKING, " +
		"SECURITY_SUM, SECURITY_RATING, SECURITY_RANKING, " +
		"LOB_SUM, LOB_RATING, LOB_RANKING, " +
		"IT_SUM, IT_RATING, IT_RANKING, " +
		"CLIENT_SUM, CLIENT_RATING, CLIENT_RANKING, " +
		"PROSPECT_SUM, PROSPECT_RATING, PROSPECT_RANKING, ICON_TEXT,CAMS_ICON_TEXT, " + addDetailUrlField +
		"from bhms.V_BEDB_MONTHLY_TRENDING_CHART_DATA " +
		"where COUNTRY_NAME = ? " +
		"and CONSTITUENTS = ? " +
		"and COLUMN = ? " +
		"and START_DATE between ? and ? " +
		"and IBMER = ?" +
		"AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y' AND USER_PROFILE = ?) " +
		"order by SEQUENCE, SEQUENCE1, START_DATE desc, TYPE");

function _trendPercentValueLabelBuild(key, array)
{
	for (var x in array[key].data[0].data)
	{
		Object.keys(array[key].data[0].data[x]).map(function(currentIndex){
			if (currentIndex.indexOf("value") > -1)
			{
				var total = array[key].data.reduce(function(prev, current) { return prev + current.data[x][currentIndex] }, 0);
				var suffix = currentIndex.substring(5);
				array[key].data.map(function(current) {
					current.data[x]['yLabel' + suffix] = current.data[x][currentIndex];
					current.data[x][currentIndex] = parseInt(current.data[x][currentIndex] / total * 10000) / 100.0;
				});
			}
		});
	}
	array[key].percentage = true;
}

function getTrendData(country, constituent, column, start, end, ibmer, profile)
{
	var resultData = WL.Server.invokeSQLStatement({
		preparedStatement : trendStatement,
		parameters : [country, constituent,  column, start, end, ibmer, profile]
	});
	if (!resultData.isSuccessful) { return resultData; }
	
	var returnValue = {
	};
	
	var tmp = null;
	var resultArray = [[], [], []];
	var returnValueArray = [];
	var isInfluencers = (resultData.resultSet.length > 0?resultData.resultSet[0]['CONSTITUENTS'] === 'INFLUENCERS' : false);
	if(isInfluencers){
		for(var e in resultData.resultSet){
			var elem = resultData.resultSet[e];
			if(elem['TYPE'].indexOf('by vendor') > -1) resultArray[0].push(elem);
	    	else if(elem['TYPE'].indexOf('from IBM') > -1) resultArray[1].push(elem);
	    	else resultArray[2].push(elem);
		}
	}else{
		resultArray[0] = resultData.resultSet;
	}
	
	for(var i in resultArray){
		for (var x in resultArray[i])
		{
			tmp = resultArray[i][x];
			if (returnValue[tmp['SEQUENCE']] == null)
			{
				returnValue[tmp['SEQUENCE']] = {
						code: tmp['METRIC_CODE'],
						title: tmp['DISPLAY_NAME'],
						camssDisplay: tmp['CAMS_DISPLAY_NAME'],
						icon: tmp['ICON_TEXT'],
						camssIcon: tmp['CAMS_ICON_TEXT'],
						period: tmp['DATA_PERIOD_TYPE'].charAt(0).toUpperCase() + tmp['DATA_PERIOD_TYPE'].substr(1).toLowerCase(),
						percentage: (tmp['NUMERIC_FORMAT'] == '%')?true:false,
							year: tmp['YEAR'],
						quarter: tmp['QUARTER'],
						month: tmp['MONTH'],
//						camssDisplay: tmp['CAMS_DISPLAY_NAME'],
						caption: null,
						detailurl:tmp['URL'],
						password:tmp['PW'],
						user_name:tmp['USER'],
						urlType:tmp['URL_TYPE'],
						bshow:tmp['URL']==null||tmp['URL']==""?false:true,
							data: {},
						chartType:'line',
						range: _getPeriodText(tmp['DATA_PERIOD_TYPE'], tmp['MONTH'], tmp['YEAR']),
						displayRank: (tmp['RANKING_DISPLAY'] != null)?tmp['RANKING_DISPLAY'].trim():null,
							displayRating : tmp['RATING'],
						displayRatingAnalytics : tmp['ANALYTICS_RATING'],
						displayRatingCognitive : tmp['COGNITIVE_RATING'],
						displayRatingCloud : tmp['CLOUD_RATING'],
						displayRatingMobile : tmp['MOBILE_RATING'],
						displayRatingSocial : tmp['SOCIAL_RATING'],
						displayRatingSecurity : tmp['SECURITY_RATING'],
						displayRatingLOB : tmp['LOB_RATING'],
						displayRatingIT : tmp['IT_RATING'],
						displayRatingClients : tmp['CLIENT_RATING'],
						displayRatingProspects : tmp['PROSPECT_RATING'],
						displayRankAnalytics : tmp['ANALYTICS_RANKING'],
						displayRankCognitive : tmp['COGNITIVE_RANKING'],
						displayRankCloud : tmp['CLOUD_RANKING'],
						displayRankMobile : tmp['MOBILE_RANKING'],
						displayRankSocial : tmp['SOCIAL_RANKING'],
						displayRankSecurity : tmp['SECURITY_RANKING'],
						displayRankLOB : tmp['LOB_RANKING'],
						displayRankIT : tmp['IT_RANKING'],
						displayRankClients : tmp['CLIENT_RANKING'],
						displayRankProspects : tmp['PROSPECT_RANKING'],
				};
			}
		
			if (returnValue[tmp['SEQUENCE']]['data'][tmp['COMPANY']] == null) {
				returnValue[tmp['SEQUENCE']]['data'][tmp['COMPANY']] = {
						company : tmp['COMPANY'],
						data : []
				};
			}
		
			var valText = 'value';
			var obj = {name : _getPeriodText(tmp['DATA_PERIOD_TYPE'], tmp['MONTH'], tmp['YEAR']), startdate: tmp['START_DATE']};
			obj[valText] = (tmp['VALUE'] != null)?parseFloat(tmp['VALUE']):null;
			obj[valText + 'Cognitive'] = (tmp['COGNITIVE_SUM'] != null)?parseFloat(tmp['COGNITIVE_SUM']):null;
			obj[valText + 'Cloud'] = (tmp['CLOUD_SUM'] != null)?parseFloat(tmp['CLOUD_SUM']):null;
			obj[valText + 'Analytics'] = (tmp['ANALYTICS_SUM'] != null)?parseFloat(tmp['ANALYTICS_SUM']):null;
			obj[valText + 'Mobile'] = (tmp['MOBILE_SUM'] != null)?parseFloat(tmp['MOBILE_SUM']):null;
			obj[valText + 'Social'] = (tmp['SOCIAL_SUM'] != null)?parseFloat(tmp['SOCIAL_SUM']):null;
			obj[valText + 'Security'] = (tmp['SECURITY_SUM'] != null)?parseFloat(tmp['SECURITY_SUM']):null;
			obj[valText + 'IT'] = (tmp['IT_SUM'] != null)?parseFloat(tmp['IT_SUM']):null;
			obj[valText + 'LOB'] = (tmp['LOB_SUM'] != null)?parseFloat(tmp['LOB_SUM']):null;
			obj[valText + 'Clients'] = (tmp['CLIENT_SUM'] != null)?parseFloat(tmp['CLIENT_SUM']):null;
			obj[valText + 'Prospects'] = (tmp['PROSPECT_SUM'] != null)?parseFloat(tmp['PROSPECT_SUM']):null;
		
			var add = true;
			for(var k in returnValue[tmp['SEQUENCE']]['data'][tmp['COMPANY']].data)
			{
				if (returnValue[tmp['SEQUENCE']]['data'][tmp['COMPANY']].data[k].name === obj.name) {
					add = false;
					break;
				}
			}
			if (add) {
				returnValue[tmp['SEQUENCE']]['data'][tmp['COMPANY']].data.push(obj);
			
				if (tmp['COMPANY'] == 'IBM' && returnValue[tmp['SEQUENCE']]['data'][tmp['COMPANY']].data.length == 2) {
					returnValue[tmp['SEQUENCE']]['pdisplayRating'] = tmp['RATING'];
					returnValue[tmp['SEQUENCE']]['pdisplayRank'] = tmp['RANKING_DISPLAY'];
					returnValue[tmp['SEQUENCE']]['pdisplayShow'] = tmp['RATING'] != null || tmp['RANKING_DISPLAY'] != null;
					returnValue[tmp['SEQUENCE']]['pdisplayRatingAnalytics'] = tmp['ANALYTICS_RATING'];
					returnValue[tmp['SEQUENCE']]['pdisplayRankAnalytics'] = tmp['ANALYTICS_RANKING'];
					returnValue[tmp['SEQUENCE']]['pdisplayShowAnalytics'] = tmp['ANALYTICS_RATING'] != null || tmp['ANALYTICS_RANKING'] != null;
					returnValue[tmp['SEQUENCE']]['pdisplayRatingCognitive'] = tmp['COGNITIVE_RATING'];
					returnValue[tmp['SEQUENCE']]['pdisplayRankCognitive'] = tmp['COGNITIVE_RANKING'];
					returnValue[tmp['SEQUENCE']]['pdisplayShowCognitive'] = tmp['COGNITIVE_RATING'] != null || tmp['COGNITIVE_RANKING'] != null;
					returnValue[tmp['SEQUENCE']]['pdisplayRatingCloud'] = tmp['CLOUD_RATING'];
					returnValue[tmp['SEQUENCE']]['pdisplayRankCloud'] = tmp['CLOUD_RANKING'];
					returnValue[tmp['SEQUENCE']]['pdisplayShowCloud'] = tmp['CLOUD_RATING'] != null || tmp['CLOUD_RANKING'] != null;
					returnValue[tmp['SEQUENCE']]['pdisplayRatingMobile'] = tmp['MOBILE_RATING'];
					returnValue[tmp['SEQUENCE']]['pdisplayRankMobile'] = tmp['MOBILE_RANKING'];
					returnValue[tmp['SEQUENCE']]['pdisplayShowMobile'] = tmp['MOBILE_RATING'] != null || tmp['MOBILE_RANKING'] != null;
					returnValue[tmp['SEQUENCE']]['pdisplayRatingSocial'] = tmp['SOCIAL_RATING'];
					returnValue[tmp['SEQUENCE']]['pdisplayRankSocial'] = tmp['SOCIAL_RANKING'];
					returnValue[tmp['SEQUENCE']]['pdisplayShowSocial'] = tmp['SOCIAL_RATING'] != null || tmp['SOCIAL_RANKING'] != null;
					returnValue[tmp['SEQUENCE']]['pdisplayRatingSecurity'] = tmp['SECURITY_RATING'];
					returnValue[tmp['SEQUENCE']]['pdisplayRankSecurity'] = tmp['SECURITY_RANKING'];
					returnValue[tmp['SEQUENCE']]['pdisplayShowSecurity'] = tmp['SECURITY_RATING'] != null || tmp['SECURITY_RANKING'] != null;
					returnValue[tmp['SEQUENCE']]['pdisplayRatingLOB'] = tmp['LOB_RATING'];
					returnValue[tmp['SEQUENCE']]['pdisplayRankLOB'] = tmp['LOB_RANKING'];
					returnValue[tmp['SEQUENCE']]['pdisplayShowLOB'] = tmp['LOB_RATING'] != null || tmp['LOB_RANKING'] != null;
					returnValue[tmp['SEQUENCE']]['pdisplayRatingIT'] = tmp['IT_RATING'];
					returnValue[tmp['SEQUENCE']]['pdisplayRankIT'] = tmp['IT_RANKING'];
					returnValue[tmp['SEQUENCE']]['pdisplayShowIT'] = tmp['IT_RATING'] != null || tmp['IT_RANKING'] != null;
					returnValue[tmp['SEQUENCE']]['pdisplayRatingClients'] = tmp['CLIENT_RATING'];
					returnValue[tmp['SEQUENCE']]['pdisplayRankClients'] = tmp['CLIENT_RANKING'];
					returnValue[tmp['SEQUENCE']]['pdisplayShowClients'] = tmp['CLIENT_RATING'] != null || tmp['CLIENT_RANKING'] != null;
					returnValue[tmp['SEQUENCE']]['pdisplayRatingProspects'] = tmp['PROSPECT_RATING'];
					returnValue[tmp['SEQUENCE']]['pdisplayRankProspects'] = tmp['PROSPECT_RANKING'];
					returnValue[tmp['SEQUENCE']]['pdisplayShowProspects'] = tmp['PROSPECT_RATING'] != null || tmp['PROSPECT_RANKING'] != null;
				}
			}
		}
		if(isInfluencers) {
			returnValueArray.push(returnValue);
		}else{
			for (var sequence in returnValue) {
				var inner_data = [];
				for (var key in returnValue[sequence].data) {
					inner_data.push(returnValue[sequence].data[key]);
				}
				returnValue[sequence].data = inner_data;
			}
			return { chartValues: returnValue };
		}
	}
	for(var j in returnValueArray){
		for (var sequence in returnValueArray[j].returnValue) {
			var inner_data = [];
			for (var key in returnValueArray[j].returnValue[sequence].data) {
				inner_data.push(returnValueArray[j].returnValue[sequence].data[key]);
			}
			returnValueArray[j].returnValue[sequence].data = inner_data;
		}
	}
	return { chartValues: returnValueArray };
}

function getCpCurrent(country, column, profile) {	
	var cpCurrentSql = cpCurrent.replace(/p_country/g, quoteWrap(country));
	cpCurrentSql = cpCurrentSql.replace(/p_column/g, column);
	cpCurrentSql = cpCurrentSql.replace(/p_profile/g, quoteWrap(profile));
	var mapping = ["KEY", "SEQUENCE", "SEQUENCE3", "SEQUENCE2", "VALUE", "COMPANY", "DISPLAY_NAME", "ANALYTICS_SUM", "COGNITIVE_SUM", "CLOUD_SUM", "MOBILE_SUM", "SOCIAL_SUM", 
	               "SECURITY_SUM", "IT_SUM", "LOB_SUM", "CLIENT_SUM", "PROSPECT_SUM", "ANALYTICS_RANKING", "ANALYTICS_RATING", "COGNITIVE_RANKING", "COGNITIVE_RATING", "CLOUD_RANKING", "CLOUD_RATING", 
	               "MOBILE_RANKING", "MOBILE_RATING", "SOCIAL_RANKING", "SOCIAL_RATING", "SECURITY_RANKING", "SECURITY_RATING", "LOB_RANKING", "LOB_RATING", 
	               "IT_RANKING", "IT_RATING", "CLIENT_RANKING", "CLIENT_RATING", "PROSPECT_RANKING", "PROSPECT_RATING", "RANKING", "RANKING_DISPLAY", "RATING", 
	               "DATA_PERIOD_TYPE", "SAMPLE_SIZE_MESSAGE", "SAMPLE_SIZE_ANALYTICS", "SAMPLE_SIZE_COGNITIVE", "SAMPLE_SIZE_CLOUD", "SAMPLE_SIZE_MOBILE", "SAMPLE_SIZE_SOCIAL", 
	               "SAMPLE_SIZE_SECURITY", "SAMPLE_SIZE_LOB", "SAMPLE_SIZE_IT", "SAMPLE_SIZE_CLIENT", "SAMPLE_SIZE_PROSPECT", "P_RATING", "ANALYTICS_RATING", 
	               "P_ANALYTICS_RATING", "P_COGNITIVE_RATING", "P_CLOUD_RATING", "P_MOBILE_RATING", "P_SOCIAL_RATING", "P_SECURITY_RATING", "P_LOB_RATING", "P_IT_RATING", "P_CLIENT_RATING", 
	               "P_PROSPECT_RATING", "P_RANKING", "P_ANALYTICS_RANKING", "P_COGNITIVE_RANKING", "P_CLOUD_RANKING", "P_MOBILE_RANKING", "P_SOCIAL_RANKING", "P_SECURITY_RANKING", 
	               "P_LOB_RANKING", "P_IT_RANKING", "P_CLIENT_RANKING", "P_PROSPECT_RANKING", "YEAR", "MONTH", "QUARTER", "TYPE", "NUMERIC_FORMAT", 
	               "CAMS_DISPLAY_NAME", "ICON_TEXT", "CAMS_ICON_TEXT", "URL", "USER", "PW", "URL_TYPE"];
	
	return invokeCpBeFormat(executeSql(cpCurrentSql, mapping));
}

function getCpByMonth(country, column, year, month, profile) {
	var cpByMonthSql = cpByMonth.replace(/p_country/g, quoteWrap(country));
	cpByMonthSql = cpByMonthSql.replace(/p_column/g, column);
	cpByMonthSql = cpByMonthSql.replace(/p_year/g, quoteWrap(year));
	cpByMonthSql = cpByMonthSql.replace(/p_month/g, quoteWrap(month));
	cpByMonthSql = cpByMonthSql.replace(/p_profile/g, quoteWrap(profile));
	var mapping = ["KEY", "SEQUENCE", "SEQUENCE3", "SEQUENCE2", "VALUE", "COMPANY", "DISPLAY_NAME", "ANALYTICS_SUM", "COGNITIVE_SUM", "CLOUD_SUM", "MOBILE_SUM", "SOCIAL_SUM", 
	               "SECURITY_SUM", "IT_SUM", "LOB_SUM", "CLIENT_SUM", "PROSPECT_SUM", "ANALYTICS_RANKING", "ANALYTICS_RATING", "COGNITIVE_RANKING", "COGNITIVE_RATING", "CLOUD_RANKING", "CLOUD_RATING", 
	               "MOBILE_RANKING", "MOBILE_RATING", "SOCIAL_RANKING", "SOCIAL_RATING", "SECURITY_RANKING", "SECURITY_RATING", "LOB_RANKING", "LOB_RATING", 
	               "IT_RANKING", "IT_RATING", "CLIENT_RANKING", "CLIENT_RATING", "PROSPECT_RANKING", "PROSPECT_RATING", "RANKING", "RANKING_DISPLAY", "RATING", 
	               "DATA_PERIOD_TYPE", "SAMPLE_SIZE_MESSAGE", "SAMPLE_SIZE_ANALYTICS", "SAMPLE_SIZE_COGNITIVE", "SAMPLE_SIZE_CLOUD", "SAMPLE_SIZE_MOBILE", "SAMPLE_SIZE_SOCIAL", 
	               "SAMPLE_SIZE_SECURITY", "SAMPLE_SIZE_LOB", "SAMPLE_SIZE_IT", "SAMPLE_SIZE_CLIENT", "SAMPLE_SIZE_PROSPECT", "P_RATING", "ANALYTICS_RATING", 
	               "P_ANALYTICS_RATING", "P_COGNITIVE_RATING", "P_CLOUD_RATING", "P_MOBILE_RATING", "P_SOCIAL_RATING", "P_SECURITY_RATING", "P_LOB_RATING", "P_IT_RATING", "P_CLIENT_RATING", 
	               "P_PROSPECT_RATING", "P_RANKING", "P_ANALYTICS_RANKING", "P_COGNITIVE_RANKING", "P_CLOUD_RANKING", "P_MOBILE_RANKING", "P_SOCIAL_RANKING", "P_SECURITY_RANKING", 
	               "P_LOB_RANKING", "P_IT_RANKING", "P_CLIENT_RANKING", "P_PROSPECT_RANKING", "YEAR", "MONTH", "QUARTER", "TYPE", "NUMERIC_FORMAT", 
	               "CAMS_DISPLAY_NAME", "ICON_TEXT", "CAMS_ICON_TEXT", "URL", "USER", "PW", "URL_TYPE"];
	
	return invokeCpBeFormat(executeSql(cpByMonthSql, mapping));
}

function invokeCpBeFormat(resultData) {
	var returnValue = {
	};
	
	var tmp = null;
	var key = null;
	
	for (var x in resultData.resultSet) {
		tmp = resultData.resultSet[x];
		
		if (returnValue[tmp['SEQUENCE']] == null) {
			if (returnValue.sortKey == null) returnValue.sortKey = tmp['SEQUENCE'];
			
			returnValue[tmp['SEQUENCE']] = {
					// xmt 2015.6.18 10:56
					detailurl:tmp['URL'],
					user_name:tmp['USER'],
					password:tmp['PW'],
					urlType:tmp['URL_TYPE'],
					bshow: tmp['URL']==null || tmp['URL']=="" ? false : true,
					szshow:true,

					title: tmp['DISPLAY_NAME'],
					icon: tmp['ICON_TEXT'],
					period: tmp['DATA_PERIOD_TYPE'].charAt(0).toUpperCase() + tmp['DATA_PERIOD_TYPE'].substr(1).toLowerCase(),
					percentage: (tmp['NUMERIC_FORMAT'] == '%') ? true : false,
					range: _getPeriodText(tmp['DATA_PERIOD_TYPE'], tmp['MONTH'], tmp['YEAR']),
					camssDisplay: tmp['CAMS_DISPLAY_NAME'],
					camssIcon: tmp['CAMS_ICON_TEXT'],
					caption: {
								sampleSizeMessage : tmp['SAMPLE_SIZE_MESSAGE'], 
								sampleSizeAnalytics : tmp['SAMPLE_SIZE_ANALYTICS'],
								sampleSizeCognitive : tmp['SAMPLE_SIZE_COGNITIVE'],
								sampleSizeCloud : tmp['SAMPLE_SIZE_CLOUD'],
								sampleSizeMobile : tmp['SAMPLE_SIZE_MOBILE'],
								sampleSizeSocial : tmp['SAMPLE_SIZE_SOCIAL'],
								sampleSizeSecurity : tmp['SAMPLE_SIZE_SECURITY'],
								sampleSizeLOB : tmp['SAMPLE_SIZE_LOB'],
								sampleSizeIT : tmp['SAMPLE_SIZE_IT'],
								sampleSizeClients : tmp['SAMPLE_SIZE_CLIENT'],
								sampleSizeProspects : tmp['SAMPLE_SIZE_PROSPECT']
							},
					data: [],
					rankdata: [],
					values: [],
					chartType:['sentiment','socialsentiment','traditionalmedia'].indexOf(tmp['SEQUENCE']) == -1?'bar':'stackedBar'
			}
		}
		
		if (returnValue[tmp['SEQUENCE']].chartType == 'bar' ? tmp['COMPANY'] == 'IBM' : tmp['COMPANY'] == 'IBM' && tmp['TYPE'].indexOf("positive/neutral") != -1) {
			returnValue[tmp['SEQUENCE']].displayRank = (tmp['RANKING_DISPLAY'] != null) ? tmp['RANKING_DISPLAY'].trim() : null;
			
			returnValue[tmp['SEQUENCE']].displayRating = tmp['RATING'];
			
			returnValue[tmp['SEQUENCE']]['displayRatingAnalytics'] = tmp['ANALYTICS_RATING']; 
			returnValue[tmp['SEQUENCE']]['displayRatingCognitive'] = tmp['COGNITIVE_RATING']; 
			returnValue[tmp['SEQUENCE']]['displayRatingCloud'] = tmp['CLOUD_RATING']; 
			returnValue[tmp['SEQUENCE']]['displayRatingMobile'] = tmp['MOBILE_RATING'];
			returnValue[tmp['SEQUENCE']]['displayRatingSocial'] = tmp['SOCIAL_RATING']; 
			returnValue[tmp['SEQUENCE']]['displayRatingSecurity'] = tmp['SECURITY_RATING']; 
			returnValue[tmp['SEQUENCE']]['displayRatingLOB'] = tmp['LOB_RATING']; 
			returnValue[tmp['SEQUENCE']]['displayRatingIT'] = tmp['IT_RATING'];
			returnValue[tmp['SEQUENCE']]['displayRatingClients'] = tmp['CLIENT_RATING']; 
			returnValue[tmp['SEQUENCE']]['displayRatingProspects'] = tmp['PROSPECT_RATING'];
			
			returnValue[tmp['SEQUENCE']]['displayRankAnalytics'] = tmp['ANALYTICS_RANKING']; 
			returnValue[tmp['SEQUENCE']]['displayRankCognitive'] = tmp['COGNITIVE_RANKING'];
			returnValue[tmp['SEQUENCE']]['displayRankCloud'] = tmp['CLOUD_RANKING']; 
			returnValue[tmp['SEQUENCE']]['displayRankMobile'] = tmp['MOBILE_RANKING']; 
			returnValue[tmp['SEQUENCE']]['displayRankSocial'] = tmp['SOCIAL_RANKING']; 
			returnValue[tmp['SEQUENCE']]['displayRankSecurity'] = tmp['SECURITY_RANKING']; 
			returnValue[tmp['SEQUENCE']]['displayRankLOB'] = tmp['LOB_RANKING']; 
			returnValue[tmp['SEQUENCE']]['displayRankIT'] = tmp['IT_RANKING']; 
			returnValue[tmp['SEQUENCE']]['displayRankClients'] = tmp['CLIENT_RANKING']; 
			returnValue[tmp['SEQUENCE']]['displayRankProspects'] = tmp['PROSPECT_RANKING'];
			
			returnValue[tmp['SEQUENCE']]['pdisplayRating'] = tmp['P_RATING'];
			returnValue[tmp['SEQUENCE']]['pdisplayRank'] = tmp['P_RANKING'];
			returnValue[tmp['SEQUENCE']]['pdisplayShow'] = tmp['P_RATING'] != null || tmp['P_RANKING'] != null;
			
			returnValue[tmp['SEQUENCE']]['pdisplayRatingAnalytics'] = tmp['P_ANALYTICS_RATING']; 
			returnValue[tmp['SEQUENCE']]['pdisplayRatingCognitive'] = tmp['P_COGNITIVE_RATING'];
			returnValue[tmp['SEQUENCE']]['pdisplayRatingCloud'] = tmp['P_CLOUD_RATING'];
			returnValue[tmp['SEQUENCE']]['pdisplayRatingMobile'] = tmp['P_MOBILE_RATING'];
			returnValue[tmp['SEQUENCE']]['pdisplayRatingSocial'] = tmp['P_SOCIAL_RATING']; 
			returnValue[tmp['SEQUENCE']]['pdisplayRatingSecurity'] = tmp['P_SECURITY_RATING']; 
			returnValue[tmp['SEQUENCE']]['pdisplayRatingLOB'] = tmp['P_LOB_RATING']; 
			returnValue[tmp['SEQUENCE']]['pdisplayRatingIT'] = tmp['P_IT_RATING'];
			returnValue[tmp['SEQUENCE']]['pdisplayRatingClients'] = tmp['P_CLIENT_RATING']; 
			returnValue[tmp['SEQUENCE']]['pdisplayRatingProspects'] = tmp['P_PROSPECT_RATING'];
			
			returnValue[tmp['SEQUENCE']]['pdisplayRankAnalytics'] = tmp['P_ANALYTICS_RANKING'];
			returnValue[tmp['SEQUENCE']]['pdisplayRankCognitive'] = tmp['P_COGNITIVE_RANKING']; 
			returnValue[tmp['SEQUENCE']]['pdisplayRankCloud'] = tmp['P_CLOUD_RANKING']; 
			returnValue[tmp['SEQUENCE']]['pdisplayRankMobile'] = tmp['P_MOBILE_RANKING']; 
			returnValue[tmp['SEQUENCE']]['pdisplayRankSocial'] = tmp['P_SOCIAL_RANKING']; 
			returnValue[tmp['SEQUENCE']]['pdisplayRankSecurity'] = tmp['P_SECURITY_RANKING']; 
			returnValue[tmp['SEQUENCE']]['pdisplayRankLOB'] = tmp['P_LOB_RANKING']; 
			returnValue[tmp['SEQUENCE']]['pdisplayRankIT'] = tmp['P_IT_RANKING']; 
			returnValue[tmp['SEQUENCE']]['pdisplayRankClients'] = tmp['P_CLIENT_RANKING']; 
			returnValue[tmp['SEQUENCE']]['pdisplayRankProspects'] = tmp['P_PROSPECT_RANKING'];
			
			returnValue[tmp['SEQUENCE']]['pdisplayShowAnalytics'] = tmp['P_ANALYTICS_RATING'] != null || tmp['P_ANALYTICS_RANKING'] != null;
			returnValue[tmp['SEQUENCE']]['pdisplayShowCognitive'] = tmp['P_COGNITIVE_RATING'] != null || tmp['P_COGNITIVE_RANKING'] != null;
			returnValue[tmp['SEQUENCE']]['pdisplayShowCloud'] = tmp['P_CLOUD_RATING'] != null || tmp['P_CLOUD_RANKING'] != null;
			returnValue[tmp['SEQUENCE']]['pdisplayShowMobile'] = tmp['P_MOBILE_RATING'] != null || tmp['P_MOBILE_RANKING'] != null;
			returnValue[tmp['SEQUENCE']]['pdisplayShowSocial'] = tmp['P_SOCIAL_RATING'] != null || tmp['P_SOCIAL_RANKING'] != null;
			returnValue[tmp['SEQUENCE']]['pdisplayShowSecurity'] = tmp['P_SECURITY_RATING'] != null || tmp['P_SECURITY_RANKING'] != null;
			returnValue[tmp['SEQUENCE']]['pdisplayShowLOB'] = tmp['P_LOB_RATING'] != null || tmp['P_LOB_RANKING'] != null;
			returnValue[tmp['SEQUENCE']]['pdisplayShowIT'] = tmp['P_IT_RATING'] != null || tmp['P_IT_RANKING'] != null;
			returnValue[tmp['SEQUENCE']]['pdisplayShowClients'] = tmp['P_CLIENT_RATING'] != null || tmp['P_CLIENT_RANKING'] != null;
			returnValue[tmp['SEQUENCE']]['pdisplayShowProspects'] = tmp['P_PROSPECT_RATING'] != null || tmp['P_PROSPECT_RANKING'] != null;
		}
		
		var valText = 'value';
		var rankText = 'rank';
		
		if ((tmp['SEQUENCE'] == 'sentiment') || (tmp['SEQUENCE'] == 'traditionalmedia') || (tmp['SEQUENCE'] == 'socialsentiment')) {
			if (tmp['TYPE'].indexOf("neutral") != -1 && tmp['TYPE'].indexOf("positive/neutral") == -1) { 
				valText = 'neutralValue';
				rankText = "neutralRank";
				
			} else if (tmp['TYPE'].indexOf("negative") != -1) { 
				valText = 'negativeValue';
				rankText = "negativeRank";
			} else if (tmp['TYPE'].indexOf("positive/neutral") != -1){
				valText = 'positiveNeutralValue';
				rankText = "positiveNeutralRank";
				if (!!!returnValue[tmp['SEQUENCE']].caption['sampleSizeMessage']) returnValue[tmp['SEQUENCE']].caption['sampleSizeMessage'] = tmp['SAMPLE_SIZE_MESSAGE'];
				if (!!!returnValue[tmp['SEQUENCE']].caption['sampleSizeAnalytics']) returnValue[tmp['SEQUENCE']].caption['sampleSizeAnalytics']=tmp['SAMPLE_SIZE_ANALYTICS'];
				if (!!!returnValue[tmp['SEQUENCE']].caption['sampleSizeCognitive']) returnValue[tmp['SEQUENCE']].caption['sampleSizeCognitive']=tmp['SAMPLE_SIZE_COGNITIVE'];	
				if (!!!returnValue[tmp['SEQUENCE']].caption['sampleSizeCloud']) returnValue[tmp['SEQUENCE']].caption['sampleSizeCloud']=tmp['SAMPLE_SIZE_CLOUD'];
				if (!!!returnValue[tmp['SEQUENCE']].caption['sampleSizeMobile']) returnValue[tmp['SEQUENCE']].caption['sampleSizeMobile']=tmp['SAMPLE_SIZE_MOBILE'];
				if (!!!returnValue[tmp['SEQUENCE']].caption['sampleSizeSocial']) returnValue[tmp['SEQUENCE']].caption['sampleSizeSocial']=tmp['SAMPLE_SIZE_SOCIAL'];
				if (!!!returnValue[tmp['SEQUENCE']].caption['sampleSizeSecurity']) returnValue[tmp['SEQUENCE']].caption['sampleSizeSecurity']=tmp['SAMPLE_SIZE_SECURITY'];
				if (!!!returnValue[tmp['SEQUENCE']].caption['sampleSizeLOB']) returnValue[tmp['SEQUENCE']].caption['sampleSizeLOB']=tmp['SAMPLE_SIZE_LOB'];
				if (!!!returnValue[tmp['SEQUENCE']].caption['sampleSizeIT']) returnValue[tmp['SEQUENCE']].caption['sampleSizeIT']=tmp['SAMPLE_SIZE_IT'];
				if (!!!returnValue[tmp['SEQUENCE']].caption['sampleSizeClients']) returnValue[tmp['SEQUENCE']].caption['sampleSizeClients']=tmp['SAMPLE_SIZE_CLIENT'];
				if (!!!returnValue[tmp['SEQUENCE']].caption['sampleSizeProspects']) returnValue[tmp['SEQUENCE']].caption['sampleSizeProspects']=tmp['SAMPLE_SIZE_PROSPECT'];
//				returnValue[tmp['SEQUENCE']].caption = {
//							sampleSizeMessage : tmp['SAMPLE_SIZE_MESSAGE'], 
//							sampleSizeAnalytics : tmp['SAMPLE_SIZE_ANALYTICS'],
//							sampleSizeCognitive : tmp['SAMPLE_SIZE_COGNITIVE'],
//							sampleSizeCloud : tmp['SAMPLE_SIZE_CLOUD'],
//							sampleSizeMobile : tmp['SAMPLE_SIZE_MOBILE'],
//							sampleSizeSocial : tmp['SAMPLE_SIZE_SOCIAL'],
//							sampleSizeSecurity : tmp['SAMPLE_SIZE_SECURITY'],
//							sampleSizeLOB : tmp['SAMPLE_SIZE_LOB'],
//							sampleSizeIT : tmp['SAMPLE_SIZE_IT'],
//							sampleSizeClients : tmp['SAMPLE_SIZE_CLIENT'],
//	                    	sampleSizeProspects : tmp['SAMPLE_SIZE_PROSPECT']
//					};
//				}
			} else {
				valText = 'positiveValue';
				rankText = "positiveRank";
			}
		}else{
			if (!!!returnValue[tmp['SEQUENCE']].caption['sampleSizeMessage']) returnValue[tmp['SEQUENCE']].caption['sampleSizeMessage'] = tmp['SAMPLE_SIZE_MESSAGE'];
			if (!!!returnValue[tmp['SEQUENCE']].caption['sampleSizeAnalytics']) returnValue[tmp['SEQUENCE']].caption['sampleSizeAnalytics']=tmp['SAMPLE_SIZE_ANALYTICS'];
			if (!!!returnValue[tmp['SEQUENCE']].caption['sampleSizeCognitive']) returnValue[tmp['SEQUENCE']].caption['sampleSizeCognitive']=tmp['SAMPLE_SIZE_COGNITIVE'];	
			if (!!!returnValue[tmp['SEQUENCE']].caption['sampleSizeCloud']) returnValue[tmp['SEQUENCE']].caption['sampleSizeCloud']=tmp['SAMPLE_SIZE_CLOUD'];
			if (!!!returnValue[tmp['SEQUENCE']].caption['sampleSizeMobile']) returnValue[tmp['SEQUENCE']].caption['sampleSizeMobile']=tmp['SAMPLE_SIZE_MOBILE'];
			if (!!!returnValue[tmp['SEQUENCE']].caption['sampleSizeSocial']) returnValue[tmp['SEQUENCE']].caption['sampleSizeSocial']=tmp['SAMPLE_SIZE_SOCIAL'];
			if (!!!returnValue[tmp['SEQUENCE']].caption['sampleSizeSecurity']) returnValue[tmp['SEQUENCE']].caption['sampleSizeSecurity']=tmp['SAMPLE_SIZE_SECURITY'];
			if (!!!returnValue[tmp['SEQUENCE']].caption['sampleSizeLOB']) returnValue[tmp['SEQUENCE']].caption['sampleSizeLOB']=tmp['SAMPLE_SIZE_LOB'];
			if (!!!returnValue[tmp['SEQUENCE']].caption['sampleSizeIT']) returnValue[tmp['SEQUENCE']].caption['sampleSizeIT']=tmp['SAMPLE_SIZE_IT'];
			if (!!!returnValue[tmp['SEQUENCE']].caption['sampleSizeClients']) returnValue[tmp['SEQUENCE']].caption['sampleSizeClients']=tmp['SAMPLE_SIZE_CLIENT'];
			if (!!!returnValue[tmp['SEQUENCE']].caption['sampleSizeProspects']) returnValue[tmp['SEQUENCE']].caption['sampleSizeProspects']=tmp['SAMPLE_SIZE_PROSPECT'];
//			if (returnValue[tmp['SEQUENCE']].caption == null) {
//				returnValue[tmp['SEQUENCE']].caption = {
//						sampleSizeMessage : tmp['SAMPLE_SIZE_MESSAGE'], 
//						sampleSizeAnalytics : tmp['SAMPLE_SIZE_ANALYTICS'],
//						sampleSizeCognitive : tmp['SAMPLE_SIZE_COGNITIVE'],
//						sampleSizeCloud : tmp['SAMPLE_SIZE_CLOUD'],
//						sampleSizeMobile : tmp['SAMPLE_SIZE_MOBILE'],
//						sampleSizeSocial : tmp['SAMPLE_SIZE_SOCIAL'],
//						sampleSizeSecurity : tmp['SAMPLE_SIZE_SECURITY'],
//						sampleSizeLOB : tmp['SAMPLE_SIZE_LOB'],
//						sampleSizeIT : tmp['SAMPLE_SIZE_IT'],
//						sampleSizeClients : tmp['SAMPLE_SIZE_CLIENT'],
//                    	sampleSizeProspects : tmp['SAMPLE_SIZE_PROSPECT']
//				};
//			}
		}
		var valObj = null;
		
		if(returnValue[tmp['SEQUENCE']]!=null){
			valObj = { name: tmp['COMPANY'] };
			valObj[valText] = (tmp['VALUE'] != null)?parseFloat(tmp['VALUE']):null;
			valObj[valText + 'Cognitive'] = (tmp['COGNITIVE_SUM'] != null)?parseFloat(tmp['COGNITIVE_SUM']):null;
			valObj[valText + 'Cloud'] = (tmp['CLOUD_SUM'] != null)?parseFloat(tmp['CLOUD_SUM']):null;
			valObj[valText + 'Analytics'] = (tmp['ANALYTICS_SUM'] != null)?parseFloat(tmp['ANALYTICS_SUM']):null;
			valObj[valText + 'Mobile'] = (tmp['MOBILE_SUM'] != null)?parseFloat(tmp['MOBILE_SUM']):null;
			valObj[valText + 'Social'] = (tmp['SOCIAL_SUM'] != null)?parseFloat(tmp['SOCIAL_SUM']):null;
			valObj[valText + 'Security'] = (tmp['SECURITY_SUM'] != null)?parseFloat(tmp['SECURITY_SUM']):null;
			valObj[valText + 'IT'] = (tmp['IT_SUM'] != null)?parseFloat(tmp['IT_SUM']):null;
			valObj[valText + 'LOB'] = (tmp['LOB_SUM'] != null)?parseFloat(tmp['LOB_SUM']):null;
			valObj[valText + 'Clients'] = (tmp['CLIENT_SUM'] != null)?parseFloat(tmp['CLIENT_SUM']):null;
			valObj[valText + 'Prospects'] = (tmp['PROSPECT_SUM'] != null)?parseFloat(tmp['PROSPECT_SUM']):null;
			valObj[rankText] = (tmp['RANKING'] != null)?parseFloat(tmp['RANKING']):0;
			valObj[rankText + 'Cognitive'] = (tmp['COGNITIVE_RANKING'] != null)?parseFloat(tmp['COGNITIVE_RANKING']):0;
			valObj[rankText + 'Cloud'] = (tmp['CLOUD_RANKING'] != null)?parseFloat(tmp['CLOUD_RANKING']):0;
			valObj[rankText + 'Analytics'] = (tmp['ANALYTICS_RANKING'] != null)?parseFloat(tmp['ANALYTICS_RANKING']):0;
			valObj[rankText + 'Mobile'] = (tmp['MOBILE_RANKING'] != null)?parseFloat(tmp['MOBILE_RANKING']):0;
			valObj[rankText + 'Social'] = (tmp['SOCIAL_RANKING'] != null)?parseFloat(tmp['SOCIAL_RANKING']):0;
			valObj[rankText + 'Security'] = (tmp['SECURITY_RANKING'] != null)?parseFloat(tmp['SECURITY_RANKING']):0;
			valObj[rankText + 'IT'] = (tmp['IT_RANKING'] != null)?parseFloat(tmp['IT_RANKING']):0;
			valObj[rankText + 'LOB'] = (tmp['LOB_RANKING'] != null)?parseFloat(tmp['LOB_RANKING']):0;
			valObj[rankText + 'Clients'] = (tmp['CLIENT_RANKING'] != null)?parseFloat(tmp['CLIENT_RANKING']):0;
			valObj[rankText + 'Prospects'] = (tmp['PROSPECT_RANKING'] != null)?parseFloat(tmp['PROSPECT_RANKING']):0;
			
			returnValue[tmp['SEQUENCE']].data.push(valObj);
			returnValue[tmp['SEQUENCE']].values.push(parseFloat(tmp['VALUE']));
		}
	}
	
	
	
	// post processing
	if (returnValue.sentiment) {
		_stackProcessor("sentiment", returnValue);
		returnValue.sentiment.chartType = 'stackedBar';
	}
	if (returnValue.socialsentiment) {
		_stackProcessor("socialsentiment", returnValue);
		returnValue.socialsentiment.chartType = 'stackedBar';
	}
	if (returnValue.traditionalmedia) {
		_stackProcessor("traditionalmedia", returnValue);
		returnValue.traditionalmedia.chartType = 'stackedBar';
	}
	
	
	
	//Object.keys(returnValue).map(function(current) { returnValue[current].data.sort(_sortByName); });
	if (returnValue.sortKey != null) beSort(returnValue);
//	
	Object.keys(returnValue).map(function(current) { 
		if (returnValue[current].percentage == false) _percentValueLabelBuild(current, returnValue); 
	});
		
	return { chartValues: returnValue };
}

function _getDecimal(value, digits) {
	return parseFloat(Math.round(parseFloat(value) * Math.pow(10,digits))) / Math.pow(10, digits);
	
}

function _sortByName(a,b) {
	return (a.name == "IBM")?-1:(b.name == "IBM")?1:(a.name < b.name)?-1:1;
}

function _getIndexOfName(name, array)
{
	for (var x in array)
	{
		if (array[x].name == name)
		{
			return x;
		}
	}
	
	return -1;
};

var cpFilteredStatement = WL.Server.createSQLStatement(
		"SELECT COUNTRY_NAME, CONSTITUENTS, COLUMN,SEQUENCE, METRIC_CODE, RECORD_TYPE, " +
		"COMPANY, TYPE, YEAR, MONTH, RANKING, VALUE, DATA_PERIOD_TYPE " +
		"FROM BHMS.V_BHMS_CP_BELIEFS_CHART_DATA " +
		"WHERE COUNTRY_NAME = ? " +
		"AND CURRENT = 'Y' AND YEAR = ? AND LTRIM(MONTH,'0') = ? " +
		"and metric_code in (select distinct metric_code from bhms_profile_metric_security where active = 'Y' and user_profile = ?) " +
		"ORDER BY COUNTRY_NAME, CONSTITUENTS, COLUMN,SEQUENCE, RANKING");

function getCpFiltered(param) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : cpFilteredStatement,
		parameters : [param]
	});
}

var cpActionListCurrent = "SELECT current.COUNTRY_NAME, current.CONSTITUENTS, current.COLUMN, " +
		"CASE WHEN current.COLUMN = 2 AND current.SEQUENCE = 6 THEN 'factoredPipeline' "+
		"WHEN current.COLUMN = 2 AND current.SEQUENCE = 8 THEN 'revenuePerClient' " + 
		"WHEN current.COLUMN = 2 AND current.SEQUENCE = 7 THEN 'newClientAcquisition'  "+
		"WHEN current.COLUMN = 2 AND current.SEQUENCE = 9 THEN 'clientAttrition' "+
		"WHEN current.COLUMN = 2 AND current.SEQUENCE = 1 THEN 'growthGapToMarket' "+
		"WHEN current.COLUMN = 3 AND current.SEQUENCE = 2 THEN 'cemr' " +
		"WHEN current.COLUMN = 3 AND current.SEQUENCE = 3 THEN 'cemt' " +
		"WHEN current.COLUMN = 3 AND current.SEQUENCE = 5 THEN 'extCaseStudy' " +
		"WHEN current.COLUMN = 3 AND current.SEQUENCE = 6 THEN 'clientRefProfile' " +
		"ELSE CAST(current.SEQUENCE as CHAR(2)) END as SEQUENCE, " +
		"current.TYPE, current.METRIC_CODE, current.COMPANY, " +
		"current.YEAR, MONTH(current.START_DATE) as MONTH, WEEK(current.START_DATE) as WEEK, current.START_DATE, " + 
		"current.TOTAL_PCT, current.DATA_PERIOD_TYPE, current.DISPLAY_NAME, " +
		"current.PY_START_DATE, current.PY_TOTAL_SUM, current.COLUMN1_TITLE, " + 
		"current.COLUMN2_TITLE, current.COLUMN3_TITLE, current.COLUMN4_TITLE, " +
		"current.VALUE, current.PY_VALUE, current.VALUE_DIFF, " +
		"current.NUMERIC_FORMAT, current.DISPLAY_COLOR, " +
		"CASE WHEN current.DISPLAY_VALUE IN ('.0%', null) THEN '0%' ELSE current.DISPLAY_VALUE END AS DISPLAY_VALUE, current.ICON_TEXT, " +
		"current.SAMPLE_SIZE_MESSAGE, current.SAMPLE_SIZE_ANALYTICS, current.SAMPLE_SIZE_COGNITIVE, current.SAMPLE_SIZE_CLOUD, " + 
		"current.SAMPLE_SIZE_MOBILE, current.SAMPLE_SIZE_SOCIAL, current.SAMPLE_SIZE_SECURITY, " +
		"current.SAMPLE_SIZE_LOB, current.SAMPLE_SIZE_IT, current.SAMPLE_SIZE_CLIENT, current.SAMPLE_SIZE_PROSPECT, " + 
		"previous.DISPLAY_COLOR as P_RATING, current.CURRENT " +
		"from " +
		"(select DISTINCT COUNTRY_NAME, CONSTITUENTS, COLUMN, SEQUENCE, TYPE, METRIC_CODE, COMPANY,   "+
		"	YEAR, START_DATE, TOTAL_PCT, DATA_PERIOD_TYPE,   "+
		"	DISPLAY_NAME, PY_START_DATE, PY_TOTAL_SUM, COLUMN1_TITLE, COLUMN2_TITLE, COLUMN3_TITLE, COLUMN4_TITLE, " +
		"   VALUE, PY_VALUE, VALUE_DIFF, " +
		"   NUMERIC_FORMAT, DISPLAY_COLOR, DISPLAY_VALUE, ICON_TEXT, " +
		"   SAMPLE_SIZE_MESSAGE, SAMPLE_SIZE_ANALYTICS, SAMPLE_SIZE_COGNITIVE, SAMPLE_SIZE_CLOUD, " +
		"   SAMPLE_SIZE_MOBILE, SAMPLE_SIZE_SOCIAL, SAMPLE_SIZE_SECURITY, " +
		"   SAMPLE_SIZE_LOB, SAMPLE_SIZE_IT, SAMPLE_SIZE_CLIENT, " +
		"   SAMPLE_SIZE_PROSPECT, CURRENT " +
		"	from BHMS.V_BHMS_CP_ACTION_LIST_DATA     "+
		"WHERE ((METRIC_CODE = 'INT16' AND CURRENT IN ('Y','P')) OR (METRIC_CODE <> 'INT16' AND CURRENT = 'Y')) " +
		"	AND COUNTRY_NAME = p_country     "+
		"	AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y'   "+
		"	AND USER_PROFILE = p_profile) "+
		") current "+
		"left join( "+
		"select MAX(first.START_DATE) AS MAX_DATE,  "+
		"second.SEQUENCE AS SEQUENCE_T, second.METRIC_CODE as METRIC_CODE_T   "+
		"from BHMS.V_BHMS_CP_ACTION_LIST_DATA first "+
		"join BHMS.V_BHMS_CP_ACTION_LIST_DATA second "+
		"on first.SEQUENCE = second.SEQUENCE "+
		"and first.METRIC_CODE = second.METRIC_CODE "+
		"and first.COUNTRY_NAME = second.COUNTRY_NAME "+
		"and first.COUNTRY_NAME = p_country "+
		"and second.CURRENT = 'Y'  "+
		"and first.START_DATE <=  "+
		" 	 case when second.DATA_PERIOD_TYPE = 'MONTHLY' then       "+
		" 	 second.START_DATE - 1 MONTH       "+
		" 	 when second.DATA_PERIOD_TYPE = 'QUARTERLY' then       "+
		" 	 second.START_DATE- 3 MONTHS       "+
		" 	 when second.DATA_PERIOD_TYPE = 'ANNUAL' then       "+
		" 	 second.START_DATE- 1 YEAR       "+
		" 	 when second.DATA_PERIOD_TYPE = 'SEMI_ANNUAL' then       "+
		" 	 second.START_DATE- 6 MONTHS       "+
		" 	 when second.DATA_PERIOD_TYPE = 'WEEKLY' then       "+
		" 	 second.START_DATE- 7 DAYS       "+
		" 	 else CAST('1900-1-1' AS DATE) end  "+
		"group by second.SEQUENCE, second.METRIC_CODE "+
		") join_table "+
		"on current.SEQUENCE = join_table.SEQUENCE_T  "+
		"and current.METRIC_CODE = join_table.METRIC_CODE_T  "+
		"left join "+
		"(select distinct SEQUENCE,METRIC_CODE,START_DATE, "+
		"   DISPLAY_COLOR, COMPANY, TYPE " +
		"	from BHMS.V_BHMS_CP_ACTION_LIST_DATA  "+
		"	where COUNTRY_NAME = p_country  "+
		") previous  "+
		"on join_table.SEQUENCE_T = previous.SEQUENCE   "+
		"and join_table.METRIC_CODE_T = previous.METRIC_CODE  "+
		"and previous.COMPANY = current.COMPANY "+
		"and previous.TYPE = current.TYPE "+
		"and previous.START_DATE = join_table.MAX_DATE   "+
		"where current.CURRENT = 'Y' OR (current.CURRENT IN ('P','H') AND current.METRIC_CODE = 'INT16' and (current.START_DATE = join_table.MAX_DATE or current.START_DATE = join_table.MAX_DATE - 9 MONTHS ) ) " +
		"ORDER BY COLUMN, SEQUENCE, TYPE, YEAR DESC, MONTH(current.START_DATE) DESC";

var cpActionListByMonth = "SELECT current.COUNTRY_NAME, current.CONSTITUENTS, current.COLUMN, " +
		"CASE WHEN current.COLUMN = 2 AND current.SEQUENCE = 6 THEN 'factoredPipeline' "+
		"WHEN current.COLUMN = 2 AND current.SEQUENCE = 8 THEN 'revenuePerClient' " + 
		"WHEN current.COLUMN = 2 AND current.SEQUENCE = 7 THEN 'newClientAcquisition'  "+
		"WHEN current.COLUMN = 2 AND current.SEQUENCE = 9 THEN 'clientAttrition' "+
		"WHEN current.COLUMN = 2 AND current.SEQUENCE = 1 THEN 'growthGapToMarket' "+
		"WHEN current.COLUMN = 3 AND current.SEQUENCE = 2 THEN 'cemr' " +
		"WHEN current.COLUMN = 3 AND current.SEQUENCE = 3 THEN 'cemt' " +
		"WHEN current.COLUMN = 3 AND current.SEQUENCE = 5 THEN 'extCaseStudy' " +
		"WHEN current.COLUMN = 3 AND current.SEQUENCE = 6 THEN 'clientRefProfile' " +
		"ELSE CAST(current.SEQUENCE as CHAR(2)) END as SEQUENCE, " +
		"current.TYPE, current.METRIC_CODE, current.COMPANY, " +
		"current.YEAR, MONTH(current.START_DATE) as MONTH, WEEK(current.START_DATE) as WEEK, current.START_DATE, " + 
		"current.TOTAL_PCT, current.DATA_PERIOD_TYPE, current.DISPLAY_NAME, " +
		"current.PY_START_DATE, current.PY_TOTAL_SUM, current.COLUMN1_TITLE, " + 
		"current.COLUMN2_TITLE, current.COLUMN3_TITLE, current.COLUMN4_TITLE, " +
		"current.VALUE, current.PY_VALUE, current.VALUE_DIFF, " +
		"current.NUMERIC_FORMAT, current.DISPLAY_COLOR, " +
		"CASE WHEN current.DISPLAY_VALUE IN ('.0%', null) THEN '0%' ELSE current.DISPLAY_VALUE END AS DISPLAY_VALUE, current.ICON_TEXT, " +
		"current.SAMPLE_SIZE_MESSAGE, current.SAMPLE_SIZE_ANALYTICS, current.SAMPLE_SIZE_COGNITIVE, current.SAMPLE_SIZE_CLOUD, " + 
		"current.SAMPLE_SIZE_MOBILE, current.SAMPLE_SIZE_SOCIAL, current.SAMPLE_SIZE_SECURITY, " +
		"current.SAMPLE_SIZE_LOB, current.SAMPLE_SIZE_IT, current.SAMPLE_SIZE_CLIENT, current.SAMPLE_SIZE_PROSPECT, " + 
		"previous.DISPLAY_COLOR as P_RATING " +
		"from " +
		"(select DISTINCT COUNTRY_NAME, CONSTITUENTS, COLUMN, SEQUENCE, TYPE, METRIC_CODE, COMPANY,   "+
		"	YEAR, START_DATE, TOTAL_PCT, DATA_PERIOD_TYPE,   "+
		"	DISPLAY_NAME, PY_START_DATE, PY_TOTAL_SUM, COLUMN1_TITLE, COLUMN2_TITLE, COLUMN3_TITLE, COLUMN4_TITLE, " +
		"   VALUE, PY_VALUE, VALUE_DIFF, " +
		"   NUMERIC_FORMAT, DISPLAY_COLOR, DISPLAY_VALUE, ICON_TEXT, " +
		"   SAMPLE_SIZE_MESSAGE, SAMPLE_SIZE_ANALYTICS, SAMPLE_SIZE_COGNITIVE, SAMPLE_SIZE_CLOUD, " +
		"   SAMPLE_SIZE_MOBILE, SAMPLE_SIZE_SOCIAL, SAMPLE_SIZE_SECURITY, " +
		"   SAMPLE_SIZE_LOB, SAMPLE_SIZE_IT, SAMPLE_SIZE_CLIENT, " +
		"   SAMPLE_SIZE_PROSPECT " +
		"	from BHMS.V_BHMS_CP_ACTION_LIST_DATA     "+
		"   join "+
		"   (SELECT DISTINCT MAX(START_DATE) AS MAX_DATE,     "+
		"	   SEQUENCE as SEQUENCE_T,  METRIC_CODE as METRIC_CODE_T "+
		"	   FROM BHMS.V_BHMS_CP_ACTION_LIST_DATA     "+
		"	   WHERE COUNTRY_NAME = p_country    "+
		"	   AND START_DATE < CAST(p_year||'-'||p_month||'-01' AS DATE) + 1 MONTHS "+
		"	   GROUP BY SEQUENCE, METRIC_CODE    "+
		"    ) TMP   "+
		"    on START_DATE = TMP.MAX_DATE "+
		"    and SEQUENCE = TMP.SEQUENCE_T "+
		"    and METRIC_CODE = TMP.METRIC_CODE_T "+
		"	AND COUNTRY_NAME = p_country AND METRIC_CODE <> 'INT16'      "+
		"	AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y'   "+
		"	AND USER_PROFILE = p_profile) "+
		") current  "+
		"left join "+
		"(select MAX(first.START_DATE) AS MAX_DATE,  "+
		"second.SEQUENCE AS SEQUENCE_T, second.METRIC_CODE as METRIC_CODE_T   "+
		"from BHMS.V_BHMS_CP_ACTION_LIST_DATA first "+
		"join BHMS.V_BHMS_CP_ACTION_LIST_DATA second "+
		"on first.SEQUENCE = second.SEQUENCE "+
		"and first.METRIC_CODE = second.METRIC_CODE "+
		"and first.COUNTRY_NAME = second.COUNTRY_NAME "+
		"and first.COUNTRY_NAME = p_country "+
		"join "+
		"(SELECT DISTINCT MAX(START_DATE) AS MAX_DATE,     "+
		"	 SEQUENCE,  METRIC_CODE "+
		"	 FROM BHMS.V_BHMS_CP_ACTION_LIST_DATA     "+
		"	 WHERE COUNTRY_NAME = p_country    "+
		"	 AND START_DATE < CAST(p_year||'-'||p_month||'-01' AS DATE) + 1 MONTHS    "+
		"	 GROUP BY SEQUENCE, METRIC_CODE    "+
		") TMP   "+
		"on second.START_DATE = TMP.MAX_DATE  "+
		"and second.SEQUENCE = TMP.SEQUENCE "+
		"and second.METRIC_CODE = TMP.METRIC_CODE "+
		"and first.START_DATE <=  "+
		" 	 case when second.DATA_PERIOD_TYPE = 'MONTHLY' then       "+
		" 	 second.START_DATE - 1 MONTH       "+
		" 	 when second.DATA_PERIOD_TYPE = 'QUARTERLY' then       "+
		" 	 second.START_DATE - 3 MONTHS       "+
		" 	 when second.DATA_PERIOD_TYPE = 'ANNUAL' then       "+
		" 	 second.START_DATE - 1 YEAR       "+
		" 	 when second.DATA_PERIOD_TYPE = 'SEMI_ANNUAL' then       "+
		" 	 second.START_DATE - 6 MONTHS       "+
		" 	 when second.DATA_PERIOD_TYPE = 'WEEKLY' then       "+
		" 	 second.START_DATE - 7 DAYS       "+
		" 	 else CAST('1900-1-1' AS DATE) end  "+
		"group by second.SEQUENCE, second.METRIC_CODE "+
		") join_table "+
		"on current.SEQUENCE = join_table.SEQUENCE_T "+
		"and current.METRIC_CODE = join_table.METRIC_CODE_T "+
		"AND current.METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y'  "+
		"AND USER_PROFILE = p_profile) "+
		"left join "+
		"(select distinct SEQUENCE,METRIC_CODE,START_DATE, "+
		"   DISPLAY_COLOR, COMPANY, TYPE " +
		"	from BHMS.V_BHMS_CP_ACTION_LIST_DATA  "+
		"	where COUNTRY_NAME = p_country  "+
		") previous  "+
		"on join_table.SEQUENCE_T = previous.SEQUENCE   "+
		"and join_table.METRIC_CODE_T = previous.METRIC_CODE  "+
		"and previous.COMPANY = current.COMPANY "+
		"and previous.TYPE = current.TYPE "+
		"and previous.START_DATE = join_table.MAX_DATE   "+
		"UNION ALL " + 
		"SELECT current.COUNTRY_NAME, current.CONSTITUENTS, current.COLUMN, " +
		"CASE WHEN current.COLUMN = 2 AND current.SEQUENCE = 6 THEN 'factoredPipeline' "+
		"WHEN current.COLUMN = 2 AND current.SEQUENCE = 8 THEN 'revenuePerClient' " + 
		"WHEN current.COLUMN = 2 AND current.SEQUENCE = 7 THEN 'newClientAcquisition'  "+
		"WHEN current.COLUMN = 2 AND current.SEQUENCE = 9 THEN 'clientAttrition' "+
		"WHEN current.COLUMN = 2 AND current.SEQUENCE = 1 THEN 'growthGapToMarket' "+
		"WHEN current.COLUMN = 3 AND current.SEQUENCE = 2 THEN 'cemr' " +
		"WHEN current.COLUMN = 3 AND current.SEQUENCE = 3 THEN 'cemt' " +
		"WHEN current.COLUMN = 3 AND current.SEQUENCE = 5 THEN 'extCaseStudy' " +
		"WHEN current.COLUMN = 3 AND current.SEQUENCE = 6 THEN 'clientRefProfile' " +
		"ELSE CAST(current.SEQUENCE as CHAR(2)) END as SEQUENCE, " +
		"current.TYPE, current.METRIC_CODE, current.COMPANY, " +
		"current.YEAR, MONTH(current.START_DATE) as MONTH, WEEK(current.START_DATE) as WEEK, current.START_DATE, " + 
		"current.TOTAL_PCT, current.DATA_PERIOD_TYPE, current.DISPLAY_NAME, " +
		"current.PY_START_DATE, current.PY_TOTAL_SUM, current.COLUMN1_TITLE, " + 
		"current.COLUMN2_TITLE, current.COLUMN3_TITLE, current.COLUMN4_TITLE, " +
		"current.VALUE, current.PY_VALUE, current.VALUE_DIFF, " +
		"current.NUMERIC_FORMAT, current.DISPLAY_COLOR, " +
		"CASE WHEN current.DISPLAY_VALUE IN ('.0%', null) THEN '0%' ELSE current.DISPLAY_VALUE END AS DISPLAY_VALUE, current.ICON_TEXT, " +
		"current.SAMPLE_SIZE_MESSAGE, current.SAMPLE_SIZE_ANALYTICS, current.SAMPLE_SIZE_COGNITIVE, current.SAMPLE_SIZE_CLOUD, " + 
		"current.SAMPLE_SIZE_MOBILE, current.SAMPLE_SIZE_SOCIAL, current.SAMPLE_SIZE_SECURITY, " +
		"current.SAMPLE_SIZE_LOB, current.SAMPLE_SIZE_IT, current.SAMPLE_SIZE_CLIENT, current.SAMPLE_SIZE_PROSPECT, " + 
		"previous.DISPLAY_COLOR as P_RATING " +
		"from " +
		"(select DISTINCT COUNTRY_NAME, CONSTITUENTS, COLUMN, SEQUENCE, TYPE, METRIC_CODE, COMPANY,   "+
		"	YEAR, START_DATE, TOTAL_PCT, DATA_PERIOD_TYPE,   "+
		"	DISPLAY_NAME, PY_START_DATE, PY_TOTAL_SUM, COLUMN1_TITLE, COLUMN2_TITLE, COLUMN3_TITLE, COLUMN4_TITLE, " +
		"   VALUE, PY_VALUE, VALUE_DIFF, " +
		"   NUMERIC_FORMAT, DISPLAY_COLOR, DISPLAY_VALUE, ICON_TEXT, " +
		"   SAMPLE_SIZE_MESSAGE, SAMPLE_SIZE_ANALYTICS, SAMPLE_SIZE_COGNITIVE, SAMPLE_SIZE_CLOUD, " +
		"   SAMPLE_SIZE_MOBILE, SAMPLE_SIZE_SOCIAL, SAMPLE_SIZE_SECURITY, " +
		"   SAMPLE_SIZE_LOB, SAMPLE_SIZE_IT, SAMPLE_SIZE_CLIENT, " +
		"   SAMPLE_SIZE_PROSPECT " +
		"	from BHMS.V_BHMS_CP_ACTION_LIST_DATA     "+
		"	WHERE COUNTRY_NAME = p_country AND METRIC_CODE = 'INT16' AND START_DATE < CAST(p_year||'-'||p_month||'-01' AS DATE) + 1 MONTHS "+
		"	AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y'   "+
		"	AND USER_PROFILE = p_profile) "+
		") current  "+
		"left join "+
		"(select MAX(first.START_DATE) AS MAX_DATE,  "+
		"second.SEQUENCE AS SEQUENCE_T, second.METRIC_CODE as METRIC_CODE_T   "+
		"from BHMS.V_BHMS_CP_ACTION_LIST_DATA first "+
		"join BHMS.V_BHMS_CP_ACTION_LIST_DATA second "+
		"on first.SEQUENCE = second.SEQUENCE "+
		"and first.METRIC_CODE = second.METRIC_CODE "+
		"and first.COUNTRY_NAME = second.COUNTRY_NAME "+
		"and first.COUNTRY_NAME = p_country "+
		"join "+
		"(SELECT DISTINCT MAX(START_DATE) AS MAX_DATE,     "+
		"	 SEQUENCE,  METRIC_CODE "+
		"	 FROM BHMS.V_BHMS_CP_ACTION_LIST_DATA     "+
		"	 WHERE COUNTRY_NAME = p_country    "+
		"	 AND START_DATE <= CAST(p_year||'-'||p_month||'-01' AS DATE)    "+
		"	 GROUP BY SEQUENCE, METRIC_CODE    "+
		") TMP   "+
		"on second.START_DATE = TMP.MAX_DATE  "+
		"and second.SEQUENCE = TMP.SEQUENCE "+
		"and second.METRIC_CODE = TMP.METRIC_CODE "+
		"and first.START_DATE <=  "+
		" 	 case when second.DATA_PERIOD_TYPE = 'MONTHLY' then       "+
		" 	 second.START_DATE - 1 MONTH       "+
		" 	 when second.DATA_PERIOD_TYPE = 'QUARTERLY' then       "+
		" 	 second.START_DATE - 3 MONTHS       "+
		" 	 when second.DATA_PERIOD_TYPE = 'ANNUAL' then       "+
		" 	 second.START_DATE - 1 YEAR       "+
		" 	 when second.DATA_PERIOD_TYPE = 'SEMI_ANNUAL' then       "+
		" 	 second.START_DATE - 6 MONTHS       "+
		" 	 when second.DATA_PERIOD_TYPE = 'WEEKLY' then       "+
		" 	 second.START_DATE - 7 DAYS       "+
		" 	 else CAST('1900-1-1' AS DATE) end  "+
		"group by second.SEQUENCE, second.METRIC_CODE "+
		") join_table "+
		"on current.SEQUENCE = join_table.SEQUENCE_T "+
		"and current.METRIC_CODE = join_table.METRIC_CODE_T "+
		"left join "+
		"(select distinct SEQUENCE,METRIC_CODE,START_DATE, "+
		"   DISPLAY_COLOR, COMPANY, TYPE " +
		"	from BHMS.V_BHMS_CP_ACTION_LIST_DATA  "+
		"	where COUNTRY_NAME = p_country  "+
		") previous  "+
		"on join_table.SEQUENCE_T = previous.SEQUENCE   "+
		"and join_table.METRIC_CODE_T = previous.METRIC_CODE  "+
		"and previous.COMPANY = current.COMPANY "+
		"and previous.TYPE = current.TYPE "+
		"and previous.START_DATE = join_table.MAX_DATE   "+
		"WHERE (current.START_DATE >= join_table.MAX_DATE or current.START_DATE = join_table.MAX_DATE - 9 MONTHS)  " +
		"ORDER BY COLUMN, SEQUENCE, TYPE, YEAR DESC, MONTH DESC";
		
		
// xmt 
function getCpActionListCurrent(param) 
{	
	return invokeCpActionListBeFormat(WL.Server.invokeSQLStatement({
		preparedStatement : cpActionListCurrent,
		parameters : param
	}));
}

function getCpActionListByMonth(country, year, month, profile) 
{	
	return invokeCpActionListBeFormat(WL.Server.invokeSQLStatement({
		preparedStatement : cpActionListByMonth,
		parameters : [country, year, month, country, profile]
	}));
}

function invokeCpActionListBeFormat(resultData){
	if (!resultData.isSuccessful) { return resultData; }
	
	var tmp = null;
	
	var returnValue = {
			factoredPipeline: {
				titles: ['Week Of', "Total"],
				data: [],
				totals: []
			},
			revenuePerClient: {
				titles: ['Week Of', "Total"],
				data: [],
				totals: []
			}
	};
	
	
//		[
//	      {
//	    	  titles: "x",
//	    	  data: "x",
//	    	  totals: "x"
//	      }
//		 ];
	
	for (x in resultData.resultSet)
	{
		tmp = resultData.resultSet[x];
		//var
		if (tmp['SEQUENCE'] == 5)
		{
			returnValue.factoredPipeline.data.push([new Date(tmp['PY_START_DATE']).toLocaleDateString(), (tmp['PY_TOTAL_SUM'] == null)?0:tmp['PY_TOTAL_SUM']]);
			returnValue.factoredPipeline.data.push([new Date(tmp['START_DATE']).toLocaleDateString(), (tmp['VALUE'] == null)?0:tmp['VALUE']]);
			returnValue.factoredPipeline.totals.push('Y2Y Growth');
			returnValue.factoredPipeline.totals.push((tmp['DISPLAY_VALUE'] == null)?0:tmp['DISPLAY_VALUE']);
			returnValue.factoredPipeline.ratingColor = tmp['DISPLAY_COLOR'];
		}
		
		if (tmp['SEQUENCE'] == 7)
		{
			returnValue.revenuePerClient.data.push([new Date(tmp['PY_START_DATE']).toLocaleDateString(), tmp['PY_TOTAL_SUM']]);
			returnValue.revenuePerClient.data.push([new Date(tmp['START_DATE']).toLocaleDateString(), tmp['VALUE']]);
			returnValue.revenuePerClient.totals.push('Y2Y Growth');
			returnValue.revenuePerClient.totals.push((tmp['DISPLAY_VALUE'] == null)?0:tmp['DISPLAY_VALUE']);
			returnValue.revenuePerClient.ratingColor = tmp['DISPLAY_COLOR'];
		}
	}
	
	return { listValues: returnValue };
}

var cpAdvocacyListCurrent = "SELECT current.COUNTRY_NAME, current.CONSTITUENTS, current.COLUMN, " +
		"CASE WHEN current.COLUMN = 2 AND current.SEQUENCE = 5 THEN 'factoredPipeline' "+
		"WHEN current.COLUMN = 2 AND current.SEQUENCE = 7 THEN 'revenuePerClient' " + 
		"WHEN current.COLUMN = 3 AND current.SEQUENCE = 2 THEN 'cemr'  "+
		"WHEN current.COLUMN = 3 AND current.SEQUENCE = 3 THEN 'cemt' "+
		"WHEN current.COLUMN = 3 AND current.SEQUENCE = 5 THEN 'extCaseStudy' " +
		"WHEN current.COLUMN = 3 AND current.SEQUENCE = 6 THEN 'clientRefProfile' " +
		"ELSE CAST(current.SEQUENCE as CHAR(2)) END as SEQUENCE, " +
		"current.METRIC_CODE, current.COMPANY, " +
		"current.YEAR, current.MONTH, WEEK(current.START_DATE) as WEEK, current.START_DATE, " + 
		"current.TOTAL_PCT, current.DATA_PERIOD_TYPE, current.DISPLAY_NAME, " +
		"current.DISPLAY_ROW_ORDER, current.DISPLAY_ROW_LABEL, current.COLUMN1_VALUE, " + 
		"current.COLUMN2_VALUE, CASE WHEN current.COLUMN3_VALUE = '.0%' THEN '0%' ELSE current.COLUMN3_VALUE END AS COLUMN3_VALUE, current.COLUMN1_TITLE, " +
		"current.COLUMN2_TITLE, current.COLUMN3_TITLE, current.COLUMN4_TITLE, " +
		"current.VALUE, current.PY_VALUE, " +
		"CASE WHEN current.DISPLAY_VALUE IN ('.0%', null) THEN '0%' ELSE current.DISPLAY_VALUE END AS DISPLAY_VALUE, current.ICON_TEXT, " +
		"current.NUMERIC_FORMAT, current.DISPLAY_COLOR, current.SAMPLE_SIZE_MESSAGE, " + 
		"current.SAMPLE_SIZE_ANALYTICS, current.SAMPLE_SIZE_COGNITIVE, current.SAMPLE_SIZE_CLOUD, current.SAMPLE_SIZE_MOBILE, " +
		"current.SAMPLE_SIZE_SOCIAL, previous.DISPLAY_COLOR as P_RATING, current.SAMPLE_SIZE_SECURITY," + 
		"current.SAMPLE_SIZE_LOB, current.SAMPLE_SIZE_IT, current.SAMPLE_SIZE_CLIENT, " +
		"current.SAMPLE_SIZE_PROSPECT, current.CURRENT, " + addDetailUrlField + 
		"from " +
		"(select DISTINCT COUNTRY_NAME, CONSTITUENTS, COLUMN, SEQUENCE,   " +
		"	METRIC_CODE, COMPANY,    " +
		"	YEAR, MONTH, START_DATE,  " +
		"   TOTAL_PCT, DATA_PERIOD_TYPE, DISPLAY_NAME, " +
		"   DISPLAY_ROW_ORDER, DISPLAY_ROW_LABEL,  " +
		"   COLUMN1_VALUE, COLUMN2_VALUE, COLUMN3_VALUE, " +
		"   COLUMN1_TITLE, COLUMN2_TITLE, COLUMN3_TITLE, COLUMN4_TITLE, " +
		"   VALUE, PY_VALUE, DISPLAY_VALUE, ICON_TEXT,  " +
		"   NUMERIC_FORMAT, DISPLAY_COLOR,  " +
		"	SAMPLE_SIZE_MESSAGE, SAMPLE_SIZE_ANALYTICS, SAMPLE_SIZE_COGNITIVE, SAMPLE_SIZE_CLOUD, " +
		"	SAMPLE_SIZE_MOBILE, SAMPLE_SIZE_SOCIAL, SAMPLE_SIZE_SECURITY, " +
		"	SAMPLE_SIZE_LOB, SAMPLE_SIZE_IT, SAMPLE_SIZE_CLIENT,  " +
		"	SAMPLE_SIZE_PROSPECT, CURRENT, " + addDetailUrlField + 
		"	from BHMS.V_BHMS_CP_ADVOCACY_LIST_DATA " +
		"	WHERE  CURRENT = 'Y'     " +
		"	AND COUNTRY_NAME = p_country     " + 
		"	AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y'   "+
		"	AND USER_PROFILE = p_profile) "+
		") current " +
		"left join( "+
		"select MAX(CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE)) AS MAX_DATE,  "+
		"second.SEQUENCE AS SEQUENCE_T, second.METRIC_CODE as METRIC_CODE_T   "+
		"from BHMS.V_BHMS_CP_ADVOCACY_LIST_DATA first "+
		"join BHMS.V_BHMS_CP_ADVOCACY_LIST_DATA second "+
		"on first.SEQUENCE = second.SEQUENCE "+
		"and first.METRIC_CODE = second.METRIC_CODE "+
		"and first.COUNTRY_NAME = second.COUNTRY_NAME "+
		"and first.COUNTRY_NAME = p_country " +
		"and second.CURRENT = 'Y'  " +
		"and CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE) <=  " +
		" 	 case when second.DATA_PERIOD_TYPE = 'MONTHLY' then       " +
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 MONTH       "+
		" 	 when second.DATA_PERIOD_TYPE = 'QUARTERLY' then       "+
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 3 MONTHS       "+
		" 	 when second.DATA_PERIOD_TYPE = 'ANNUAL' then       "+
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 YEAR       "+
		" 	 when second.DATA_PERIOD_TYPE = 'SEMI_ANNUAL' then       "+
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 6 MONTHS       "+
		" 	 when second.DATA_PERIOD_TYPE = 'WEEKLY' then       "+
		" 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 7 DAYS       "+
		" 	 else CAST('1900-1-1' AS DATE) end "+
		"group by second.SEQUENCE, second.METRIC_CODE "+
		") join_table "+
		"on current.SEQUENCE = join_table.SEQUENCE_T  "+
		"and current.METRIC_CODE = join_table.METRIC_CODE_T  "+
		"left join " +
		"(select distinct SEQUENCE, METRIC_CODE, YEAR, MONTH, " +
		"   DISPLAY_COLOR, COMPANY, DISPLAY_ROW_ORDER " +
		"	from BHMS.V_BHMS_CP_ADVOCACY_LIST_DATA  " +
		"	where COUNTRY_NAME = p_country  " +
		") previous  " +
		"on join_table.SEQUENCE_T = previous.SEQUENCE  " +
		"and join_table.METRIC_CODE_T = previous.METRIC_CODE  " +
		"and previous.COMPANY = current.COMPANY " +
		"and previous.DISPLAY_ROW_ORDER = current.DISPLAY_ROW_ORDER " +
		"and CAST(trim(previous.YEAR)||'-'||trim(previous.MONTH)||'-01' AS DATE) = join_table.MAX_DATE   "+
		"ORDER BY COLUMN, SEQUENCE, DISPLAY_ROW_ORDER";

var cpAdvocacyListByMonth = "SELECT current.COUNTRY_NAME, current.CONSTITUENTS, current.COLUMN, " +
		"CASE WHEN current.COLUMN = 2 AND current.SEQUENCE = 5 THEN 'factoredPipeline' "+
		"WHEN current.COLUMN = 2 AND current.SEQUENCE = 7 THEN 'revenuePerClient' " + 
		"WHEN current.COLUMN = 3 AND current.SEQUENCE = 2 THEN 'cemr'  "+
		"WHEN current.COLUMN = 3 AND current.SEQUENCE = 3 THEN 'cemt' "+
		"WHEN current.COLUMN = 3 AND current.SEQUENCE = 5 THEN 'extCaseStudy' " +
		"WHEN current.COLUMN = 3 AND current.SEQUENCE = 6 THEN 'clientRefProfile' " +
		"ELSE CAST(current.SEQUENCE as CHAR(2)) END as SEQUENCE, " +
		"current.METRIC_CODE, current.COMPANY, " +
		"current.YEAR, current.MONTH, WEEK(current.START_DATE) as WEEK, current.START_DATE, " + 
		"current.TOTAL_PCT, current.DATA_PERIOD_TYPE, current.DISPLAY_NAME, " +
		"current.DISPLAY_ROW_ORDER, current.DISPLAY_ROW_LABEL, current.COLUMN1_VALUE, " + 
		"current.COLUMN2_VALUE, CASE WHEN current.COLUMN3_VALUE = '.0%' THEN '0%' ELSE current.COLUMN3_VALUE END AS COLUMN3_VALUE, current.COLUMN1_TITLE, " +
		"current.COLUMN2_TITLE, current.COLUMN3_TITLE, current.COLUMN4_TITLE, " +
		"current.VALUE, current.PY_VALUE, " +
		"CASE WHEN current.DISPLAY_VALUE IN ('.0%', null) THEN '0%' ELSE current.DISPLAY_VALUE END AS DISPLAY_VALUE, current.ICON_TEXT, " +
		"current.NUMERIC_FORMAT, current.DISPLAY_COLOR, current.SAMPLE_SIZE_MESSAGE, " + 
		"current.SAMPLE_SIZE_ANALYTICS, current.SAMPLE_SIZE_COGNITIVE, current.SAMPLE_SIZE_CLOUD, current.SAMPLE_SIZE_MOBILE, " +
		"current.SAMPLE_SIZE_SOCIAL, previous.DISPLAY_COLOR as P_RATING, current.SAMPLE_SIZE_SECURITY," + 
		"current.SAMPLE_SIZE_LOB, current.SAMPLE_SIZE_IT, current.SAMPLE_SIZE_CLIENT, " +
		"current.SAMPLE_SIZE_PROSPECT, current.CURRENT, " + addDetailUrlField + 
		"from " +
		"(select DISTINCT COUNTRY_NAME, CONSTITUENTS, COLUMN, SEQUENCE,   " +
		"	METRIC_CODE, COMPANY,    " +
		"	YEAR, MONTH, START_DATE,  " +
		"   TOTAL_PCT, DATA_PERIOD_TYPE, DISPLAY_NAME, " +
		"   DISPLAY_ROW_ORDER, DISPLAY_ROW_LABEL,  " +
		"   COLUMN1_VALUE, COLUMN2_VALUE, COLUMN3_VALUE, " +
		"   COLUMN1_TITLE, COLUMN2_TITLE, COLUMN3_TITLE, COLUMN4_TITLE, " +
		"   VALUE, PY_VALUE, DISPLAY_VALUE, ICON_TEXT,  " +
		"   NUMERIC_FORMAT, DISPLAY_COLOR,  " +
		"	SAMPLE_SIZE_MESSAGE, SAMPLE_SIZE_ANALYTICS, SAMPLE_SIZE_COGNITIVE, SAMPLE_SIZE_CLOUD, " +
		"	SAMPLE_SIZE_MOBILE, SAMPLE_SIZE_SOCIAL, SAMPLE_SIZE_SECURITY, " +
		"	SAMPLE_SIZE_LOB, SAMPLE_SIZE_IT, SAMPLE_SIZE_CLIENT,  " +
		"	SAMPLE_SIZE_PROSPECT, CURRENT, " + addDetailUrlField + 
		"	from BHMS.V_BHMS_CP_ADVOCACY_LIST_DATA " +
		"   join "+
		"   (SELECT DISTINCT MAX(CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE)) AS MAX_DATE,     " +
		"	   SEQUENCE as SEQUENCE_T,  METRIC_CODE as METRIC_CODE_T "+
		"	   FROM BHMS.V_BHMS_CP_ADVOCACY_LIST_DATA     "+
		"	   WHERE COUNTRY_NAME = p_country    "+
		"	   AND CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE) <= CAST(p_year||'-'||p_month||'-01' AS DATE)    " +
		"	   GROUP BY SEQUENCE, METRIC_CODE    "+
		"    ) TMP   "+
		"    on CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE) = TMP.MAX_DATE " +
		"    and SEQUENCE = TMP.SEQUENCE_T "+
		"    and METRIC_CODE = TMP.METRIC_CODE_T " +
		"	AND COUNTRY_NAME = p_country       " +
		"	AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y'   "+
		"	AND USER_PROFILE = p_profile) "+
		") current  " +
		"left join "+
		"(select MAX(CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE)) AS MAX_DATE,  "+
		"second.SEQUENCE AS SEQUENCE_T, second.METRIC_CODE as METRIC_CODE_T   "+
		"from BHMS.V_BHMS_CP_ADVOCACY_LIST_DATA first "+
		"join BHMS.V_BHMS_CP_ADVOCACY_LIST_DATA second "+
		"on first.SEQUENCE = second.SEQUENCE "+
		"and first.METRIC_CODE = second.METRIC_CODE "+
		"and first.COUNTRY_NAME = second.COUNTRY_NAME "+
		"and first.COLUMN = second.COLUMN "+
		"and first.COUNTRY_NAME = p_country "+
		"join "+
		"(SELECT DISTINCT MAX(CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE)) AS MAX_DATE,     "+
		"	 SEQUENCE,  METRIC_CODE "+
		"	 FROM BHMS.V_BHMS_CP_ADVOCACY_LIST_DATA     "+
		"	 WHERE COUNTRY_NAME = p_country    "+
		"	 AND CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE) <= CAST(p_year||'-'||p_month||'-01' AS DATE)    "+
		"	 GROUP BY SEQUENCE, METRIC_CODE    "+
		") TMP   "+
		"on CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE) = TMP.MAX_DATE  "+
		"and second.SEQUENCE = TMP.SEQUENCE "+
		"and second.METRIC_CODE = TMP.METRIC_CODE "+
		"and CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE) <=  "+
		"	 case when second.DATA_PERIOD_TYPE = 'MONTHLY' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 MONTH    "+
		"	 when second.DATA_PERIOD_TYPE = 'QUARTERLY' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 3 MONTHS    "+
		"	 when second.DATA_PERIOD_TYPE = 'ANNUAL' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 YEAR    "+
		"	 when second.DATA_PERIOD_TYPE = 'SEMI_ANNUAL' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 6 MONTHS    "+
		"	 when second.DATA_PERIOD_TYPE = 'WEEKLY' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 7 DAYS    "+
		"	 else CAST('1900-1-1' AS DATE) end "+
		"group by second.SEQUENCE, second.METRIC_CODE "+
		") join_table "+
		"on current.SEQUENCE = join_table.SEQUENCE_T "+
		"and current.METRIC_CODE = join_table.METRIC_CODE_T "+
		"left join " +
		"(select distinct SEQUENCE, METRIC_CODE, YEAR, MONTH, " +
		"   DISPLAY_COLOR, COMPANY, DISPLAY_ROW_ORDER " +
		"	from BHMS.V_BHMS_CP_ADVOCACY_LIST_DATA  " +
		"	where COUNTRY_NAME = p_country  " +
		") previous  " +
		"on join_table.SEQUENCE_T = previous.SEQUENCE  " +
		"and join_table.METRIC_CODE_T = previous.METRIC_CODE  " +
		"and previous.COMPANY = current.COMPANY " +
		"and previous.DISPLAY_ROW_ORDER = current.DISPLAY_ROW_ORDER " +
		"and CAST(trim(previous.YEAR)||'-'||trim(previous.MONTH)||'-01' AS DATE) = join_table.MAX_DATE   "+
		"ORDER BY COLUMN, SEQUENCE, DISPLAY_ROW_ORDER";

function getCpListCurrent(country, option, profile) {	
	var resultData = null;
	
	if (option == 1) {
		var cpActionListCurrentSql = cpActionListCurrent.replace(/p_country/g, quoteWrap(country));
		cpActionListCurrentSql = cpActionListCurrentSql.replace(/p_profile/g, quoteWrap(profile));
		var mapping = ["COUNTRY_NAME", "CONSTITUENTS", "COLUMN", "SEQUENCE", "TYPE", "METRIC_CODE", "COMPANY", "YEAR", "MONTH", "WEEK", 
		               "START_DATE", "TOTAL_PCT", "DATA_PERIOD_TYPE", "DISPLAY_NAME", "PY_START_DATE", "PY_TOTAL_SUM", "COLUMN1_TITLE", 
		               "COLUMN2_TITLE", "COLUMN3_TITLE", "COLUMN4_TITLE", "VALUE", "PY_VALUE", "VALUE_DIFF", "NUMERIC_FORMAT", 
		               "DISPLAY_COLOR", "DISPLAY_VALUE", "ICON_TEXT", "SAMPLE_SIZE_MESSAGE", "SAMPLE_SIZE_ANALYTICS", "SAMPLE_SIZE_COGNITIVE", "SAMPLE_SIZE_CLOUD", 
		               "SAMPLE_SIZE_MOBILE", "SAMPLE_SIZE_SOCIAL", "SAMPLE_SIZE_SECURITY", "SAMPLE_SIZE_LOB", "SAMPLE_SIZE_IT", 
		               "SAMPLE_SIZE_CLIENT", "SAMPLE_SIZE_PROSPECT", "P_RATING", "CURRENT"];
		resultData = executeSql(cpActionListCurrentSql, mapping);
	} else {
		var cpAdvocacyListCurrentSql = cpAdvocacyListCurrent.replace(/p_country/g, quoteWrap(country));
		cpAdvocacyListCurrentSql = cpAdvocacyListCurrentSql.replace(/p_profile/g, quoteWrap(profile));
		var mapping = ["COUNTRY_NAME", "CONSTITUENTS", "COLUMN", "SEQUENCE", "METRIC_CODE", "COMPANY", "YEAR", "MONTH", "WEEK", "START_DATE", 
		               "TOTAL_PCT", "DATA_PERIOD_TYPE", "DISPLAY_NAME", "DISPLAY_ROW_ORDER", "DISPLAY_ROW_LABEL", "COLUMN1_VALUE","COLUMN2_VALUE",
		               "COLUMN3_VALUE", "COLUMN1_TITLE","COLUMN2_TITLE", "COLUMN3_TITLE", "COLUMN4_TITLE", "VALUE", "PY_VALUE","DISPLAY_VALUE", "ICON_TEXT", 
		               "NUMERIC_FORMAT", "DISPLAY_COLOR", "SAMPLE_SIZE_MESSAGE","SAMPLE_SIZE_ANALYTICS", "SAMPLE_SIZE_COGNITIVE", "SAMPLE_SIZE_CLOUD", "SAMPLE_SIZE_MOBILE",
		               "SAMPLE_SIZE_SOCIAL", "P_RATING", "SAMPLE_SIZE_SECURITY","SAMPLE_SIZE_LOB", "SAMPLE_SIZE_IT", "SAMPLE_SIZE_CLIENT",
		               "SAMPLE_SIZE_PROSPECT", "CURRENT", "URL", "USER", "PW", "URL_TYPE" ];
		resultData = executeSql(cpAdvocacyListCurrentSql, mapping);
	}
	
	return invokeCpListBeFormat(resultData);
}	

function getCpListByMonth(country, option, year, month, profile) {	
	var resultData = null;
	
	if (option == 1) {
		var cpActionListByMonthSql = cpActionListByMonth.replace(/p_country/g, quoteWrap(country));
		cpActionListByMonthSql = cpActionListByMonthSql.replace(/p_year/g, quoteWrap(year));
		cpActionListByMonthSql = cpActionListByMonthSql.replace(/p_month/g, quoteWrap(month));
		cpActionListByMonthSql = cpActionListByMonthSql.replace(/p_profile/g, quoteWrap(profile));
		var mapping = ["COUNTRY_NAME", "CONSTITUENTS", "COLUMN", "SEQUENCE", "TYPE", "METRIC_CODE", "COMPANY", "YEAR", "MONTH", "WEEK", 
		               "START_DATE", "TOTAL_PCT", "DATA_PERIOD_TYPE", "DISPLAY_NAME", "PY_START_DATE", "PY_TOTAL_SUM", "COLUMN1_TITLE", 
		               "COLUMN2_TITLE", "COLUMN3_TITLE", "COLUMN4_TITLE", "VALUE", "PY_VALUE", "VALUE_DIFF", "NUMERIC_FORMAT", 
		               "DISPLAY_COLOR", "DISPLAY_VALUE", "ICON_TEXT", "SAMPLE_SIZE_MESSAGE", "SAMPLE_SIZE_ANALYTICS", "SAMPLE_SIZE_COGNITIVE", "SAMPLE_SIZE_CLOUD", 
		               "SAMPLE_SIZE_MOBILE", "SAMPLE_SIZE_SOCIAL", "SAMPLE_SIZE_SECURITY", "SAMPLE_SIZE_LOB", "SAMPLE_SIZE_IT", 
		               "SAMPLE_SIZE_CLIENT", "SAMPLE_SIZE_PROSPECT", "P_RATING"];
		resultData = executeSql(cpActionListByMonthSql, mapping);
	} else {
		var cpAdvocacyListByMonthSql = cpAdvocacyListByMonth.replace(/p_country/g, quoteWrap(country));
		cpAdvocacyListByMonthSql = cpAdvocacyListByMonthSql.replace(/p_year/g, quoteWrap(year));
		cpAdvocacyListByMonthSql = cpAdvocacyListByMonthSql.replace(/p_month/g, quoteWrap(month));
		cpAdvocacyListByMonthSql = cpAdvocacyListByMonthSql.replace(/p_profile/g, quoteWrap(profile));
		var mapping = ["COUNTRY_NAME", "CONSTITUENTS", "COLUMN", "SEQUENCE", "METRIC_CODE", "COMPANY", "YEAR", "MONTH", "WEEK", "START_DATE", 
		               "TOTAL_PCT", "DATA_PERIOD_TYPE", "DISPLAY_NAME","DISPLAY_ROW_ORDER", "DISPLAY_ROW_LABEL", "COLUMN1_VALUE","COLUMN2_VALUE",
		               "COLUMN3_VALUE", "COLUMN1_TITLE","COLUMN2_TITLE", "COLUMN3_TITLE", "COLUMN4_TITLE", "VALUE", "PY_VALUE","DISPLAY_VALUE", "ICON_TEXT", 
		               "NUMERIC_FORMAT", "DISPLAY_COLOR", "SAMPLE_SIZE_MESSAGE","SAMPLE_SIZE_ANALYTICS", "SAMPLE_SIZE_COGNITIVE","SAMPLE_SIZE_CLOUD", "SAMPLE_SIZE_MOBILE",
		               "SAMPLE_SIZE_SOCIAL", "P_RATING", "SAMPLE_SIZE_SECURITY","SAMPLE_SIZE_LOB", "SAMPLE_SIZE_IT", "SAMPLE_SIZE_CLIENT",
		               "SAMPLE_SIZE_PROSPECT","URL", "USER", "PW", "URL_TYPE", "CURRENT" ];
		resultData = executeSql(cpAdvocacyListByMonthSql, mapping);
	}
	
	return invokeCpListBeFormat(resultData);
}

function invokeCpListBeFormat(resultData) {
	var returnValue = {};
	var tmp = null;

	for (x in resultData.resultSet) {
		tmp = resultData.resultSet[x];

		if (!returnValue[tmp['SEQUENCE']]) {
			returnValue[tmp['SEQUENCE']] = {
				// xmt 2015.6.19 10:37
				detailurl:tmp['URL'],
				user_name:tmp['USER'],
				password:tmp['PW'],
				urlType:tmp['URL_TYPE'],
				bshow: tmp['URL']==null || tmp['URL']=="" ? false : true,
				szshow:true,	
				metricCode: tmp['METRIC_CODE'],

				ratingColor: (tmp['DISPLAY_COLOR'] != null)?tmp['DISPLAY_COLOR']:"Grey",
				pratingColor: tmp['P_RATING'],
				pdisplayShow : tmp['P_RATING'] != null,

				tableTitle: tmp['DISPLAY_NAME'],
				icon: tmp['ICON_TEXT'],
				period: tmp['DATA_PERIOD_TYPE'].charAt(0).toUpperCase() + tmp['DATA_PERIOD_TYPE'].substr(1).toLowerCase(),
				range: _getPeriodText(tmp['DATA_PERIOD_TYPE'], tmp['MONTH'], tmp['YEAR'], tmp['WEEK']),
				caption: null,
				data: [],
				chartType : 'table'
			};

			//build titles
			returnValue[tmp['SEQUENCE']].titles = [];
			if (tmp['SEQUENCE'] == 'newClientAcquisition') {
				returnValue[tmp['SEQUENCE']].titles.push(tmp['COLUMN1_TITLE']);
				returnValue[tmp['SEQUENCE']].titles.push('New Clients (to IBM)');
				returnValue[tmp['SEQUENCE']].titles.push('New to Brand');
			} else {
				for (var x = 1; x <= 4; x++) {
					if ((tmp['COLUMN' + x + '_TITLE'] != null) && (tmp['COLUMN' + x + '_TITLE'] != "")) {
						returnValue[tmp['SEQUENCE']].titles.push(tmp['COLUMN' + x + '_TITLE']);
					}
				}
			}
		}

		if (tmp['SAMPLE_SIZE_MESSAGE'] != null || tmp['SAMPLE_SIZE_ANALYTICS'] != null || tmp['SAMPLE_SIZE_COGNITIVE'] != null || tmp['SAMPLE_SIZE_CLOUD'] != null 
			|| tmp['SAMPLE_SIZE_MOBILE'] != null || tmp['SAMPLE_SIZE_SOCIAL'] != null || tmp['SAMPLE_SIZE_SECURITY'] != null 
			|| tmp['SAMPLE_SIZE_LOB'] != null || tmp['SAMPLE_SIZE_IT'] != null || tmp['SAMPLE_SIZE_CLIENT'] != null || tmp['SAMPLE_SIZE_PROSPECT'] != null) 
			returnValue[tmp['SEQUENCE']].caption = {sampleSizeMessage : tmp['SAMPLE_SIZE_MESSAGE'], 
		                                            sampleSizeAnalytics : tmp['SAMPLE_SIZE_ANALYTICS'],
		                                            sampleSizeCognitive : tmp['SAMPLE_SIZE_COGNITIVE'],
		                                            sampleSizeCloud : tmp['SAMPLE_SIZE_CLOUD'],
		                                            sampleSizeMobile : tmp['SAMPLE_SIZE_MOBILE'],
		                                            sampleSizeSocial : tmp['SAMPLE_SIZE_SOCIAL'],
		                                            sampleSizeSecurity : tmp['SAMPLE_SIZE_SECURITY'],
		                                            sampleSizeLOB : tmp['SAMPLE_SIZE_LOB'],
		                                            sampleSizeIT : tmp['SAMPLE_SIZE_IT'],
		                                            sampleSizeClients : tmp['SAMPLE_SIZE_CLIENT'],
		                                            sampleSizeProspects : tmp['SAMPLE_SIZE_PROSPECT']
													};

		if((tmp['SEQUENCE'] == 'growthGapToMarket')){
			returnValue[tmp['SEQUENCE']].data.push(['IBM', _getPeriodText(tmp['DATA_PERIOD_TYPE'], tmp['MONTH'], tmp['YEAR'], tmp['WEEK']), tmp['DISPLAY_VALUE']]);
//			returnValue[tmp['SEQUENCE']].data.push(['IBM', ]);
//			returnValue[tmp['SEQUENCE']].data.push(['IBM', ]);
			
		}else if ((tmp['SEQUENCE'] == 'factoredPipeline')) {
			returnValue[tmp['SEQUENCE']].data.push([tmp['PY_START_DATE'] == null?"No data to display":new Date(tmp['PY_START_DATE'].replace(/-/g, "/")).toLocaleDateString(), (tmp['PY_TOTAL_SUM'] == null)?"No data to display":Math.round(tmp['PY_TOTAL_SUM'])]);
			returnValue[tmp['SEQUENCE']].data.push([new Date(tmp['START_DATE'].replace(/-/g, "/")).toLocaleDateString(), (tmp['VALUE'] == null)?0:Math.round(tmp['VALUE'])]);
			returnValue[tmp['SEQUENCE']].totals= ['Y2Y Change'];
			returnValue[tmp['SEQUENCE']].totals.push((tmp['DISPLAY_VALUE'] == null)?"0%":tmp['DISPLAY_VALUE']);
		} else if ((tmp['SEQUENCE'] == 'revenuePerClient') || (tmp['SEQUENCE'] == 'clientAttrition')) {
			var pyDate;
			var pyMonth;
			var pyYear;
			if (tmp['PY_START_DATE'] != null) {
				pyDate = new Date(tmp['PY_START_DATE'].replace(/-/g, "/"));
				pyMonth = pyDate.getMonth() + 1;
				pyYear = pyDate.getFullYear();
			}

			returnValue[tmp['SEQUENCE']].data.push([tmp['PY_START_DATE']==null?"No data to display":_getPeriodText(tmp['DATA_PERIOD_TYPE'], pyMonth, pyYear, 0), (tmp['PY_TOTAL_SUM'] == null)?"No data to display":Math.round(tmp['PY_TOTAL_SUM'])]);
			returnValue[tmp['SEQUENCE']].data.push([_getPeriodText(tmp['DATA_PERIOD_TYPE'], tmp['MONTH'], tmp['YEAR'], tmp['WEEK']), (tmp['VALUE'] == null)?0:Math.round(tmp['VALUE'])]);

			if (tmp['SEQUENCE'] == 'clientAttrition') {
				returnValue[tmp['SEQUENCE']].totals= ['Y2Y Change'];
			} else {
				returnValue[tmp['SEQUENCE']].totals= ['Y2Y Change'];
			}
			returnValue[tmp['SEQUENCE']].totals.push((tmp['DISPLAY_VALUE'] == null)?"0%":tmp['DISPLAY_VALUE']);

		} else if (tmp['SEQUENCE'] == 'newClientAcquisition') {
			var pyDate;
			var pyMonth;
			var pyYear;
			if (tmp['PY_START_DATE'] != null) {
				pyDate = new Date(tmp['PY_START_DATE'].replace(/-/g, "/"));
				pyMonth = pyDate.getMonth() + 1;
				pyYear = pyDate.getFullYear();
			}
			
			if (tmp['TYPE'].trim() == 'new client acquisition') {
				returnValue[tmp['SEQUENCE']].data.push([tmp['PY_START_DATE']==null?"No data to display":_getPeriodText(tmp['DATA_PERIOD_TYPE'], pyMonth, pyYear, 0), (tmp['PY_TOTAL_SUM'] == null)?"No data to display":Math.round(tmp['PY_TOTAL_SUM'])]);
				returnValue[tmp['SEQUENCE']].data.push([_getPeriodText(tmp['DATA_PERIOD_TYPE'], tmp['MONTH'], tmp['YEAR'], tmp['WEEK']), (tmp['VALUE'] == null)?0:Math.round(tmp['VALUE'])]);
				returnValue[tmp['SEQUENCE']].totals= ['Y2Y Change'];
				returnValue[tmp['SEQUENCE']].totals.push((tmp['DISPLAY_VALUE'] == null)?"0%":tmp['DISPLAY_VALUE']);
			} else if (tmp['TYPE'].trim() == 'new to brand') {
				returnValue[tmp['SEQUENCE']].data[0].push((tmp['PY_TOTAL_SUM'] == null)?"No data to display":Math.round(tmp['PY_TOTAL_SUM']));
				returnValue[tmp['SEQUENCE']].data[1].push((tmp['VALUE'] == null)?0:Math.round(tmp['VALUE']));
				returnValue[tmp['SEQUENCE']].totals.push((tmp['DISPLAY_VALUE'] == null)?"0%":tmp['DISPLAY_VALUE']);
			}

		} else {		
			returnValue[tmp['SEQUENCE']].data.push([tmp['DISPLAY_ROW_LABEL'], (tmp['COLUMN1_VALUE'] == null)?"":tmp['COLUMN1_VALUE'].toString(), (tmp['COLUMN2_VALUE'] == null)?"":tmp['COLUMN2_VALUE'].toString(), (tmp['COLUMN3_VALUE'] == null)?"":tmp['COLUMN3_VALUE']]);
		}
	}

	// this should not be necessary, but 500 error is thrown otherwise
	returnValue = JSON.stringify(returnValue);
	returnValue = JSON.parse(returnValue);

	return { listValues: returnValue };
} 

var cpDashboardStatement = WL.Server.createSQLStatement(			
	"SELECT distinct metric_code, CASE WHEN column = 1 THEN 'Belief' WHEN column = 2 THEN 'Action'  " +
	"WHEN column = 3 THEN 'Advocacy' ELSE 'Other' END as KEY, SEQUENCE, DISPLAY_VALUE, CAMS_DISPLAY_NAME, COLOR_CODE, " + 
	"DISPLAY_NAME, ANALYTICS, ANALYTICS_RATING, ANALYTICS_COLOR, COGNITIVE, COGNITIVE_RATING, COGNITIVE_COLOR, CLOUD,  " +
	"CLOUD_RATING, CLOUD_COLOR, MOBILE, MOBILE_RATING, MOBILE_COLOR, SOCIAL, SOCIAL_RATING, " + 
	"ANALYTICS_RANKING, COGNITIVE_RANKING, CLOUD_RANKING, MOBILE_RANKING, SOCIAL_RANKING, SECURITY_RANKING, LOB_RANKING, IT_RANKING, CLIENT_RANKING, PROSPECT_RANKING, " +
	"SOCIAL_COLOR, SECURITY, SECURITY_RATING, SECURITY_COLOR, LOB, LOB_RATING, LOB_COLOR, IT, IT_RATING, " +
	"IT_COLOR, CLIENT, CLIENT_RATING, CLIENT_COLOR, PROSPECT, PROSPECT_RATING, PROSPECT_COLOR, ICON_TEXT, CAMS_ICON_TEXT FROM V_BHMS_DASHBOARD_RANKED_LISTS_DATA " +
	"WHERE COUNTRY_NAME = ? AND CONSTITUENTS = 'CLIENTS & PROSPECTS' AND CURRENT = 'Y' " +
	"AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y' AND USER_PROFILE = ?) " +
	"ORDER BY KEY, SEQUENCE");
//"where COUNTRY_NAME = ? and COMPANY = 'IBM' and CONSTITUENTS = 'CLIENTS & PROSPECTS' order by key, sequence");

var cpDashboardByMonthStatement = WL.Server.createSQLStatement(			
		"SELECT DISTINCT METRIC_CODE, CASE WHEN column = 1 THEN 'Belief' WHEN column = 2 THEN 'Action'  " +
		"WHEN column = 3 THEN 'Advocacy' ELSE 'Other' END as KEY, SEQUENCE, DISPLAY_VALUE, CAMS_DISPLAY_NAME, COLOR_CODE, " + 
		"DISPLAY_NAME, ANALYTICS, ANALYTICS_RATING, ANALYTICS_COLOR, COGNITIVE, COGNITIVE_RATING, COGNITIVE_COLOR, CLOUD,  " +
		"CLOUD_RATING, CLOUD_COLOR, MOBILE, MOBILE_RATING, MOBILE_COLOR, SOCIAL, SOCIAL_RATING, " + 
		"ANALYTICS_RANKING, COGNITIVE_RANKING, CLOUD_RANKING, MOBILE_RANKING, SOCIAL_RANKING, SECURITY_RANKING, LOB_RANKING, IT_RANKING, CLIENT_RANKING, PROSPECT_RANKING, " +
		"SOCIAL_COLOR, SECURITY, SECURITY_RATING, SECURITY_COLOR, LOB, LOB_RATING, LOB_COLOR, IT, IT_RATING, " +
		"IT_COLOR, CLIENT, CLIENT_RATING, CLIENT_COLOR, PROSPECT, PROSPECT_RATING, PROSPECT_COLOR, ICON_TEXT, CAMS_ICON_TEXT " +
		"FROM V_BHMS_DASHBOARD_RANKED_LISTS_DATA , (SELECT DISTINCT MAX(TO_NUMBER(TRIM(YEAR)||LPAD(TRIM(LTRIM(MONTH,0)), 2, '0'))) AS MAX_DATE, COLUMN AS COLUMN_T, SEQUENCE AS SEQUENCE_T " +
		"FROM V_BHMS_DASHBOARD_RANKED_LISTS_DATA " +
		"WHERE COUNTRY_NAME = ? " +
		"AND CONSTITUENTS = 'CLIENTS & PROSPECTS' " + 
		"AND TO_NUMBER(TRIM(YEAR)||LPAD(TRIM(LTRIM(MONTH,0)), 2, '0')) <= TO_NUMBER(?||LPAD(?, 2, '0')) " + 
		"GROUP BY COLUMN,SEQUENCE) TMP " + 
		"WHERE COUNTRY_NAME = ? AND CONSTITUENTS = 'CLIENTS & PROSPECTS' " + 
		"AND TO_NUMBER(TRIM(YEAR)||LPAD(TRIM(LTRIM(MONTH,0)), 2, '0'))= TMP.MAX_DATE " +
		"AND COLUMN = TMP.COLUMN_T " +
		"AND SEQUENCE = TMP.SEQUENCE_T " +
		"AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y' AND USER_PROFILE = ?) " +
		"ORDER BY KEY, SEQUENCE");

function getCPDashboardCurrent(country, profile) 
{	
	var resultData = WL.Server.invokeSQLStatement({
		preparedStatement : cpDashboardStatement,
		parameters : [country, profile]
	});
	return invokeCPDashboardBePie(resultData);
}

function getCPDashboardByMonth(country, year, month, profile) 
{	
	var resultData = WL.Server.invokeSQLStatement({
		preparedStatement : cpDashboardByMonthStatement,
		parameters : [country, year, month, country, profile]
	});
	return invokeCPDashboardBePie(resultData);
}

function invokeCPDashboardBePie(resultData){
	if (!resultData.isSuccessful) { return resultData; }
	
	var returnValue = {	};
	
	var tmp = null;
	var sequence = 1;
	for (var x in resultData.resultSet)
	{
		tmp = resultData.resultSet[x];
		returnValue[(typeof returnValue[tmp['KEY'] + "_" 
		             + tmp['SEQUENCE']] === 'undefined')?tmp['KEY'] + "_" 
		             + tmp['SEQUENCE']:(tmp['KEY'] + "_" 
		             + (parseInt(tmp['SEQUENCE']) + sequence++) + "")] = {
			"Color" : tmp['COLOR_CODE'],
			"DisplayValue" : tmp['DISPLAY_VALUE'],
			"Icon" : tmp['ICON_TEXT'],
			"camssIcon": tmp['CAMS_ICON_TEXT'],
			"DisplayName" : tmp['DISPLAY_NAME'],
			"camssDisplay": tmp['CAMS_DISPLAY_NAME'],
			"Cognitive" : tmp['COGNITIVE_COLOR'],
			"Cloud" : tmp['CLOUD_COLOR'],
			"Analytics" : tmp['ANALYTICS_COLOR'],
			"Mobile" : tmp['MOBILE_COLOR'],
			"Social" : tmp['SOCIAL_COLOR'],
			"Security" : tmp['SECURITY_COLOR'],
			"IT" : tmp['IT_COLOR'],
			"LOB" : tmp['LOB_COLOR'],
			"Clients" : tmp['CLIENT_COLOR'],
			"Prospects" : tmp['PROSPECT_COLOR'],
			"rankAnalytics" : tmp['ANALYTICS_RANKING'], 
			"rankCognitive" : tmp['COGNITIVE_RANKING'], 
			"rankCloud" : tmp['CLOUD_RANKING'], 
			"rankMobile" : tmp['MOBILE_RANKING'], 
			"rankSocial" : tmp['SOCIAL_RANKING'], 
			"rankSecurity" : tmp['SECURITY_RANKING'], 
			"rankLOB" : tmp['LOB_RANKING'], 
			"rankIT" : tmp['IT_RANKING'], 
			"rankClients" : tmp['CLIENT_RANKING'], 
			"rankProspects" : tmp['PROSPECT_RANKING']
		};
	}
	
	return { pieValues: returnValue };
}

var cpDashboardChartsStatement = WL.Server.createSQLStatement(
	"SELECT distinct metric_code, CASE WHEN column = 1 THEN 'Belief' WHEN column = 2 THEN 'Action' " +
	"WHEN column = 3 THEN 'Advocacy' ELSE 'Other' END as KEY, " +
	"CASE WHEN COMPANY = 'IBM' THEN 1 ELSE 2 END AS SEQUENCE1, " + 
	"SEQUENCE, " +
	"VALUE, " +
	"COMPANY, DISPLAY_NAME, ICON_TEXT, " +
	"ANALYTICS_SUM, COGNITIVE_SUM, CLOUD_SUM, MOBILE_SUM, SOCIAL_SUM, SECURITY_SUM, " +
	"ANALYTICS_RANKING, ANALYTICS_RATING, COGNITIVE_RANKING, COGNITIVE_RATING, CLOUD_RANKING, CLOUD_RATING, MOBILE_RANKING, MOBILE_RATING, SOCIAL_RANKING, SOCIAL_RATING, SECURITY_RANKING, SECURITY_RATING, " +
	"LOB_RANKING, LOB_RATING, IT_RANKING, IT_RATING, CLIENT_RANKING, CLIENT_RATING, PROSPECT_RANKING, PROSPECT_RATING, " +
	"RANKING, RANKING_DISPLAY, RATING, DATA_PERIOD_TYPE, SAMPLE_SIZE_MESSAGE, " +
	"IT_SUM, LOB_SUM, CLIENT_SUM, PROSPECT_SUM, " +
	"YEAR, MONTH, QUARTER " +
	"FROM V_BHMS_CP_CHART_DATA " +
	"where COUNTRY_NAME = ? " +
	"AND CURRENT = 'Y' " +
	"AND SEQUENCE = 1 " +
	"and metric_code in (select distinct metric_code from bhms_profile_metric_security where active = 'Y' and user_profile = ?) " +
	"order by SEQUENCE1, VALUE DESC");

var cpDashboardChartsByMonthStatement = WL.Server.createSQLStatement(
		"SELECT DISTINCT metric_code, CASE WHEN column = 1 THEN 'Belief' WHEN column = 2 THEN 'Action' " +
		"WHEN column = 3 THEN 'Advocacy' ELSE 'Other' END as KEY, " +
		"CASE WHEN COMPANY = 'IBM' THEN 1 ELSE 2 END AS SEQUENCE1, " + 
		"SEQUENCE, " +
		"VALUE, " +
		"COMPANY, DISPLAY_NAME, ICON_TEXT, " +
		"ANALYTICS_SUM, COGNITIVE_SUM, CLOUD_SUM, MOBILE_SUM, SOCIAL_SUM, SECURITY_SUM, " +
		"ANALYTICS_RANKING, ANALYTICS_RATING, COGNITIVE_RANKING, COGNITIVE_RATING, CLOUD_RANKING, CLOUD_RATING, MOBILE_RANKING, MOBILE_RATING, SOCIAL_RANKING, SOCIAL_RATING, SECURITY_RANKING, SECURITY_RATING, " +
		"LOB_RANKING, LOB_RATING, IT_RANKING, IT_RATING, CLIENT_RANKING, CLIENT_RATING, PROSPECT_RANKING, PROSPECT_RATING, " +
		"RANKING, RANKING_DISPLAY, RATING, DATA_PERIOD_TYPE, SAMPLE_SIZE_MESSAGE, " +
		"IT_SUM, LOB_SUM, CLIENT_SUM, PROSPECT_SUM, " +
		"YEAR, MONTH, QUARTER " +
		"FROM V_BHMS_CP_CHART_DATA , (SELECT DISTINCT MAX(TO_NUMBER(TRIM(YEAR)||LPAD(TRIM(LTRIM(MONTH,0)), 2, '0'))) AS MAX_DATE, COLUMN AS COLUMN_T  " +
		"FROM V_BHMS_CP_CHART_DATA " +
		"WHERE COUNTRY_NAME = ? " +
		"AND SEQUENCE = 1 " +
		"AND TO_NUMBER(TRIM(YEAR)||LPAD(TRIM(LTRIM(MONTH,0)), 2, '0')) <= TO_NUMBER(?||LPAD(?, 2, '0'))  " +
		"GROUP BY COLUMN,SEQUENCE) TMP  " +
		"WHERE COUNTRY_NAME = ? " +
		"AND TO_NUMBER(TRIM(YEAR)||LPAD(TRIM(LTRIM(MONTH,0)), 2, '0'))= TMP.MAX_DATE " +
		"AND COLUMN = TMP.COLUMN_T " +
		"AND SEQUENCE = 1 " +
		"AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y' AND USER_PROFILE = ?) " +
		"ORDER BY SEQUENCE1, VALUE DESC");

function getCPDashboardChartsCurrent(country, profile) 
{	
	return invokeCPDashboardBeFormat(WL.Server.invokeSQLStatement({
		preparedStatement : cpDashboardChartsStatement,
		parameters : [country, profile]
	})
	);
}

function getCPDashboardChartsByMonth(country, year, month, profile) 
{	
	return invokeCPDashboardBeFormat(WL.Server.invokeSQLStatement({
		preparedStatement : cpDashboardChartsByMonthStatement,
		parameters : [country, year, month, country, profile]
	})
	);
}

function invokeCPDashboardBeFormat(resultData){
	
	if (!resultData.isSuccessful) { return resultData; }
	
	var returnValue = {	};
	
	var tmp = null;
	
	for (var x in resultData.resultSet)
	{
		tmp = resultData.resultSet[x];
		
		if (returnValue[tmp['KEY']])
		{
			returnValue[tmp['KEY']].data.push({
				"Value" : tmp['VALUE'],
				"Company" : tmp['COMPANY'],
				"Cognitive" : tmp['COGNITIVE_SUM'],
				"Cloud" : tmp['CLOUD_SUM'],
				"Analytics" : tmp['ANALYTICS_SUM'],
				"Mobile" : tmp['MOBILE_SUM'],
				"Social" : tmp['SOCIAL_SUM'],
				"Security" : tmp['SECURITY_SUM'],
				"IT" : tmp['IT_SUM'],
				"LOB" : tmp['LOB_SUM'],
				"Clients" : tmp['CLIENT_SUM'],
				"Prospects" : tmp['PROSPECT_SUM'],
				"Rank" : tmp['RANKING'],
				"RankCognitive" : tmp['COGNITIVE_RANKING'],
				"RankCloud" : tmp['CLOUD_RANKING'],
				"RankAnalytics" : tmp['ANALYTICS_RANKING'],
				"RankMobile" : tmp['MOBILE_RANKING'],
				"RankSocial" : tmp['SOCIAL_RANKING'],
				"RankSecurity" : tmp['SECURITY_RANKING'],
				"RankIT" : tmp['IT_RANKING'],
				"RankLOB" : tmp['LOB_RANKING'],
				"RankClients" : tmp['CLIENT_RANKING'],
				"RankProspects" : tmp['PROSPECT_RANKING']		
			});
		}
		else
		{
			returnValue[tmp['KEY']] = { "DisplayName" : tmp['DISPLAY_NAME'], 
					"Icon": tmp['ICON_TEXT'],
					"displayRating": tmp['RATING'],
					"displayRatingAnalytics": tmp['ANALYTICS_RATING'],
					"displayRatingCognitive": tmp['COGNITIVE_RATING'],
					"displayRatingCloud": tmp['CLOUD_RATING'],
					"displayRatingMobile": tmp['MOBILE_RATING'],
					"displayRatingSocial": tmp['SOCIAL_RATING'], 
					"displayRatingSecurity": tmp['SECURITY_RATING'], 
					"displayRatingLOB": tmp['LOB_RATING'],
					"displayRatingIT": tmp['IT_RATING'],
					"displayRatingClients": tmp['CLIENT_RATING'], 
					"displayRatingProspects": tmp['PROSPECT_RATING'],
					"data": [{
				"Value" : tmp['VALUE'],
				"Company" : tmp['COMPANY'],
				"Cognitive" : tmp['COGNITIVE_SUM'],
				"Cloud" : tmp['CLOUD_SUM'],
				"Analytics" : tmp['ANALYTICS_SUM'],
				"Mobile" : tmp['MOBILE_SUM'],
				"Social" : tmp['SOCIAL_SUM'],
				"Security" : tmp['SECURITY_SUM'],
				"IT" : tmp['IT_SUM'],
				"LOB" : tmp['LOB_SUM'],
				"Clients" : tmp['CLIENT_SUM'],
				"Prospects" : tmp['PROSPECT_SUM'],
				"Rank" : tmp['RANKING'],
				"RankCognitive" : tmp['COGNITIVE_RANKING'],
				"RankCloud" : tmp['CLOUD_RANKING'],
				"RankAnalytics" : tmp['ANALYTICS_RANKING'],
				"RankMobile" : tmp['MOBILE_RANKING'],
				"RankSocial" : tmp['SOCIAL_RANKING'],
				"RankSecurity" : tmp['SECURITY_RANKING'],
				"RankIT" : tmp['IT_RANKING'],
				"RankLOB" : tmp['LOB_RANKING'],
				"RankClients" : tmp['CLIENT_RANKING'],
				"RankProspects" : tmp['PROSPECT_RANKING']	
			}]};
		}
	}
	
	return { chartValues: returnValue };
}


function getViewableCountries() {
	var invocationData = {
	        adapter : 'Credentials',
	        procedure : 'getGroups'
	    };
	
	var invocationResult = WL.Server.invokeProcedure(invocationData);
	var tmpGroups = invocationResult.result.map(function() {return "?";});
	var groups = tmpGroups.join(",");
	
	var query = "select distinct a.country, b.description from bluegroup_country a, reference b where b.type = 'CO' and a.country = b.code and bluegroup in (" + groups + ") order by description";
//	WL.Logger.warn("invocationResult->" + invocationResult + ", invocationResult.result->" + invocationResult.result);
	//for testing
	//var query = "select a.country, b.description from bluegroup_country a, reference b where b.type = 'CO' and a.country = b.code and bluegroup in ('IBM.Brand.Health.Germany','IBM.Brand.Health.China','IBM.Brand.Health.France') order by description";
	
	//get the datasource can grab a database connection.
    var ctx = new javax.naming.InitialContext();
    var ds = ctx.lookup(myDataSource);
	var con = ds.getConnection();
	var statement = con.prepareStatement(query);
	
	invocationResult.result.map(function(item, index) { statement.setString(index + 1, item) });
	
	var resultSet = statement.executeQuery();
	var countries = [];
	
	while (resultSet.next()) {
		countries.push({ "code": resultSet.getString("country"), "country": resultSet.getString("description").trim() });
	}

	resultSet.close();
	statement.close();
	//con.close();
	resultSet = null;
	statement = null;
	con = null;
	
	//WL.Logger.error(countries);
	
	return { "countries": countries };
}

//xmt 2015.7.8 16:49
var getWWIOTListStatement = WL.Server.createSQLStatement(
		"SELECT bluegroup, country " +
		  "FROM BHMS.BLUEGROUP_COUNTRY " +
		 "WHERE BLUEGROUP LIKE 'IBM.Brand.Health.IOT%' or BLUEGROUP = 'IBM.Brand.Health.WW' " +
		"ORDER BY BLUEGROUP"
);

function getWWIOTList(param) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : getWWIOTListStatement,
		parameters : [param]
	});
}

// xmt 2015.8.20 16:56
var getSecurityProfileStatement = WL.Server.createSQLStatement(
		"SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y' AND USER_PROFILE = ?"
);

function getSecurityProfile(param) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : getSecurityProfileStatement,
		parameters : [param]
	});
}

var getMetricModelStatement = WL.Server.createSQLStatement(
	  "SELECT METRIC_CODE, " +
		     "CONSTITUENTS, " +
		     "COLUMN, " +
		     "SEQUENCE, " +
		     "DISPLAY_NAME, " +
		     "CAMS_DISPLAY_NAME, " +
		     "CASE " +
			  "WHEN METRIC_CODE = 'BHM1' THEN 'Brand' " +
			  "WHEN METRIC_CODE = 'BHM10' THEN 'Provider' " +
			  "WHEN METRIC_CODE = 'PR20' THEN 'Mentions Sent''t' " +
			  "WHEN METRIC_CODE = 'BHM5' THEN 'Relevance' " +
			  "WHEN METRIC_CODE = 'BHM6' THEN 'Optimize'	" +	
			  "WHEN METRIC_CODE = 'INT1' THEN 'Market Share' " +
			  "WHEN METRIC_CODE = 'BHM3' THEN 'Preference' " +
			  "WHEN METRIC_CODE = 'BHM4' THEN 'Engagement' " +
			  "WHEN METRIC_CODE = 'BHM7' THEN 'Proposal' " +
			  "WHEN METRIC_CODE = 'BHM8' THEN 'Recommended' " +
			  "WHEN METRIC_CODE = 'PR25' THEN 'Ampf''d Sent''t'	" +	
			  "WHEN METRIC_CODE = 'BHM9' THEN 'Likelihood' " +
			  "WHEN METRIC_CODE = 'PR24' THEN 'Social Share'	" +	
			  "WHEN METRIC_CODE = 'PR1' THEN 'Mentions SOV' " +
			  "WHEN METRIC_CODE = 'INT2' THEN 'Factored Pipeline' " +
			  "WHEN METRIC_CODE = 'PR23' THEN 'Orig Sent''t' " +
			  "WHEN METRIC_CODE = 'INT3' THEN 'Client Acquisition' " +
			  "WHEN METRIC_CODE = 'INT4' THEN 'Revenue Client' " +
			  "WHEN METRIC_CODE = 'INT5' THEN 'Client Attrition' " +
			  "WHEN METRIC_CODE = 'CEM1' THEN 'CEM-R' " +
			  "WHEN METRIC_CODE = 'CEM5' THEN 'CEM-T' " +
			  "WHEN METRIC_CODE = 'INT6' THEN 'Profile' " +
			  "WHEN METRIC_CODE = 'PR6' AND COLUMN = 1 THEN 'Influencers SOV' " +
			  "WHEN METRIC_CODE = 'PR6' AND COLUMN = 2 THEN 'Mentions SOV' " +
			  "WHEN METRIC_CODE = 'PR4' THEN 'Identified' " +
			  "WHEN METRIC_CODE = 'PR5' THEN 'Reach' " +
			  "WHEN METRIC_CODE = 'PR21' THEN 'Mentions Sent''t' " +
			  "WHEN METRIC_CODE = 'PR8' THEN 'Engage' " +
			  "WHEN METRIC_CODE = 'PR19' THEN 'IBMers' " +
			  "WHEN METRIC_CODE = 'INT7' THEN 'ibm.com' " +
			  "WHEN METRIC_CODE = 'PR28' THEN 'Amplf''d SOV' " +
			  "WHEN METRIC_CODE = 'PR27' AND COLUMN = 1 THEN 'Influencers Orig' " +
			  "WHEN METRIC_CODE = 'PR27' AND COLUMN = 2 THEN 'Orig SOV' " +
			  "WHEN METRIC_CODE = 'PR12' THEN 'Inflr SOV' " +
			  "WHEN METRIC_CODE = 'PR22' THEN 'Ampf''d Sent''t' " +
			  "WHEN METRIC_CODE = 'PR21' THEN 'Influencers Sentiment' " +
			  "WHEN METRIC_CODE = 'PR16' THEN 'Orig Sent''t' " +
			  "WHEN METRIC_CODE = 'NDS1' THEN 'Consideration' " +
			  "WHEN METRIC_CODE = 'PR14' THEN 'Mentions SOV' " +
			  "WHEN METRIC_CODE = 'NDS3' THEN 'Familiarity' " +
			  "WHEN METRIC_CODE = 'NDS8' THEN 'Existing Environment' " +
			  "WHEN METRIC_CODE = 'PR31' THEN 'Mentions Sent''t' " +
			  "WHEN METRIC_CODE = 'NDS9' THEN 'APIs' " +
			  "WHEN METRIC_CODE = 'NDS10' THEN 'Used Quickly' " +
			  "WHEN METRIC_CODE = 'NDS5' THEN 'Use Platform' " +
			  "WHEN METRIC_CODE = 'PR15' THEN 'Engagement' " +
			  "WHEN METRIC_CODE = 'INT12' THEN 'Registrants' " +
			  "WHEN METRIC_CODE = 'NDS4' THEN 'Trial' " +
			  "WHEN METRIC_CODE = 'NDS2' THEN 'provider' " +
			  "WHEN METRIC_CODE = 'NDS7' THEN 'Recommended' " +
			  "WHEN METRIC_CODE = 'PR29' THEN 'Orig SOV' " +
			  "WHEN METRIC_CODE = 'PR18' THEN 'Ampf''d SOV' " +
			  "WHEN METRIC_CODE = 'NDS6' THEN 'Likelihood' " +
			  "WHEN METRIC_CODE = 'PR30' THEN 'Orig Sent''t' " +
			  "WHEN METRIC_CODE = 'PR32' THEN 'Ampf''d Sent''t' " +
			  "WHEN METRIC_CODE = 'EMP9' THEN 'Engagement' " +
			  "WHEN METRIC_CODE = 'EMP11' THEN 'Proud' " +
			  "WHEN METRIC_CODE = 'EMP1' THEN 'Great' " +
			  "WHEN METRIC_CODE = 'EMP7' THEN 'Recommend' " +
			  "ELSE NULL " +
		  "END 	AS SHORT_NAME, " +
		  "CASE " +
		  	"WHEN METRIC_CODE = 'BHM1' THEN 'Brand' " +
		  	"WHEN METRIC_CODE = 'BHM10' THEN 'Category Awareness' " +
		  	"WHEN METRIC_CODE = 'PR20' THEN 'Mentions Sent''t' " +
		  	"WHEN METRIC_CODE = 'BHM5' THEN 'Relevance' " +
		  	"WHEN METRIC_CODE = 'BHM6' THEN 'Optimize'	" +	
		  	"WHEN METRIC_CODE = 'INT1' THEN 'Market Share' " +
		  	"WHEN METRIC_CODE = 'BHM3' THEN 'Preference' " +
		  	"WHEN METRIC_CODE = 'BHM4' THEN 'Engagement' " +
		  	"WHEN METRIC_CODE = 'BHM7' THEN 'Proposal' " +
		  	"WHEN METRIC_CODE = 'BHM8' THEN 'Recommended' " +
		  	"WHEN METRIC_CODE = 'PR25' THEN 'Ampf''d Sent''t'	" +	
		  	"WHEN METRIC_CODE = 'BHM9' THEN 'Likelihood' " +
		  	"WHEN METRIC_CODE = 'PR24' THEN 'Social Share'	" +	
		  	"WHEN METRIC_CODE = 'PR1' THEN 'Mentions SOV' " +
		  	"WHEN METRIC_CODE = 'INT2' THEN 'Factored Pipeline' " +
		  	"WHEN METRIC_CODE = 'PR23' THEN 'Orig Sent''t' " +
		  	"WHEN METRIC_CODE = 'INT3' THEN 'Client Acquisition' " +
		  	"WHEN METRIC_CODE = 'INT4' THEN 'Revenue Client' " +
		  	"WHEN METRIC_CODE = 'INT5' THEN 'Client Attrition' " +
		  	"WHEN METRIC_CODE = 'CEM1' THEN 'CEM-R' " +
		  	"WHEN METRIC_CODE = 'CEM5' THEN 'CEM-T' " +
		  	"WHEN METRIC_CODE = 'INT6' THEN 'Profile' " +
		  	"WHEN METRIC_CODE = 'PR6' AND COLUMN = 1 THEN 'Influencers SOV' " +
			"WHEN METRIC_CODE = 'PR6' AND COLUMN = 2 THEN 'Mentions SOV' " +
			"WHEN METRIC_CODE = 'PR4' THEN 'Identified' " +
			"WHEN METRIC_CODE = 'PR5' THEN 'Reach' " +
			"WHEN METRIC_CODE = 'PR21' THEN 'Mentions Sent''t' " +
			"WHEN METRIC_CODE = 'PR8' THEN 'Engage' " +
			"WHEN METRIC_CODE = 'PR19' THEN 'IBMers' " +
			"WHEN METRIC_CODE = 'INT7' THEN 'ibm.com' " +
			"WHEN METRIC_CODE = 'PR28' THEN 'Amplf''d SOV' " +
			"WHEN METRIC_CODE = 'PR27' AND COLUMN = 1 THEN 'Influencers Orig' " +
			"WHEN METRIC_CODE = 'PR27' AND COLUMN = 2 THEN 'Orig SOV' " +
		  	"WHEN METRIC_CODE = 'PR12' THEN 'Inflr SOV' " +
		  	"WHEN METRIC_CODE = 'PR22' THEN 'Ampf''d Sent''t' " +
		  	"WHEN METRIC_CODE = 'PR21' THEN 'Influencers Sentiment' " +
		  	"WHEN METRIC_CODE = 'PR16' THEN 'Orig Sent''t' " +
		  	"WHEN METRIC_CODE = 'NDS1' THEN 'Consideration' " +
		  	"WHEN METRIC_CODE = 'PR14' THEN 'Mentions SOV' " +
		  	"WHEN METRIC_CODE = 'NDS3' THEN 'Familiarity' " +
		  	"WHEN METRIC_CODE = 'NDS8' THEN 'Existing Environment' " +
		  	"WHEN METRIC_CODE = 'PR31' THEN 'Mentions Sent''t' " +
		  	"WHEN METRIC_CODE = 'NDS9' THEN 'APIs' " +
		  	"WHEN METRIC_CODE = 'NDS10' THEN 'Used Quickly' " +
		  	"WHEN METRIC_CODE = 'NDS5' THEN 'Use Platform' " +
		  	"WHEN METRIC_CODE = 'PR15' THEN 'Engagement' " +
		  	"WHEN METRIC_CODE = 'INT12' THEN 'Registrants' " +
		  	"WHEN METRIC_CODE = 'NDS4' THEN 'Trial' " +
		  	"WHEN METRIC_CODE = 'NDS2' THEN 'provider' " +
		  	"WHEN METRIC_CODE = 'NDS7' THEN 'Recommended' " +
		  	"WHEN METRIC_CODE = 'PR29' THEN 'Orig SOV' " +
		  	"WHEN METRIC_CODE = 'PR18' THEN 'Ampf''d SOV' " +
		  	"WHEN METRIC_CODE = 'NDS6' THEN 'Likelihood' " +
		  	"WHEN METRIC_CODE = 'PR30' THEN 'Orig Sent''t' " +
		  	"WHEN METRIC_CODE = 'PR32' THEN 'Ampf''d Sent''t' " +
		  	"WHEN METRIC_CODE = 'EMP9' THEN 'Engagement' " +
		  	"WHEN METRIC_CODE = 'EMP11' THEN 'Proud' " +
		  	"WHEN METRIC_CODE = 'EMP1' THEN 'Great' " +
		  	"WHEN METRIC_CODE = 'EMP7' THEN 'Recommend' " +
		  "ELSE NULL " +
		  "END 	AS CAMSS_SHORT_NAME " +
		"FROM V_BHMS_DASHBOARD_REPORTING_IOT_LISTS_DATA " +
		"WHERE METRIC_CODE <> 'PR12' " +
	"GROUP BY METRIC_CODE, CONSTITUENTS, COLUMN, SEQUENCE, DISPLAY_NAME, CAMS_DISPLAY_NAME " +
	"ORDER BY CONSTITUENTS, COLUMN, SEQUENCE, METRIC_CODE" 		
);

function getMetricModel(param) {
	return WL.Server.invokeSQLStatement({
		preparedStatement : getMetricModelStatement,
		parameters : [param]
	});
}

var getCPStrategicCharacteristicsCurrentStatement = "SELECT current.COMPANY AS COMPANY, " +
		  "current.DISPLAY_NAME AS DISPLAY_NAME, " +
		  "current.ICON_TEXT AS ICON_TEXT, " +
		  "current.DATA_PERIOD_TYPE AS DATA_PERIOD_TYPE, " +
		  "current.METRIC_CODE AS METRIC_CODE, " +
		  "current.OVERALL_SUM AS OVERALL_SUM, " +
		  "current.RATING AS RATING, " +
		  "current.RANKING AS RANKING, " +
		  "current.RANKING_DISPLAY AS RANKING_DISPLAY, " +
		  "current.SEQUENCE AS SEQUENCE, " +
		  "current.TYPE AS TYPE, " +
		  "current.YEAR AS YEAR, " +
		  "CURRENT.MONTH AS MONTH, " +
		  "previous.RATING as P_RATING, " +
		  "previous.RANKING as P_RANKING, " +      
		  "current.QUARTER AS QUARTER, " +
		  "current.PAGE_CHART_TYPE AS PAGE_CHART_TYPE, " +
		  "current.SAMPLE_SIZE_MESSAGE AS SAMPLE_SIZE_MESSAGE, " +
		  "current.NUMERIC_FORMAT AS NUMERIC_FORMAT, " + addDetailUrlField + 
		  "from " +
		  "(select DISTINCT COLUMN, COMPANY, DISPLAY_NAME, ICON_TEXT, DATA_PERIOD_TYPE, METRIC_CODE,  " + 
		  "OVERALL_SUM, RATING, RANKING, RANKING_DISPLAY, SEQUENCE, TYPE, YEAR, MONTH, " +
		  "QUARTER, PAGE_CHART_TYPE, SAMPLE_SIZE_MESSAGE, NUMERIC_FORMAT, " + addDetailUrlField + 
		  "	from BHMS.V_BHMS_CP_CHART_DATA " +
		  "	WHERE  CURRENT = 'Y' " +
		  "	AND COUNTRY_NAME = p_country " + 
		  "	AND COLUMN = 4  " +
		  "	AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y'   "+
		  "	AND USER_PROFILE = p_profile) "+
		  ") current " +
		  "left join( " +
		  "select MAX(CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE)) AS MAX_DATE,  " +
		  "second.SEQUENCE AS SEQUENCE_T, second.METRIC_CODE as METRIC_CODE_T " +
		  "from BHMS.V_BHMS_CP_CHART_DATA first " +
		  "join BHMS.V_BHMS_CP_CHART_DATA second " +
		  "on first.SEQUENCE = second.SEQUENCE " +
		  "and first.METRIC_CODE = second.METRIC_CODE " +
		  "and first.COUNTRY_NAME = second.COUNTRY_NAME " +
		  "and first.COLUMN = second.COLUMN " +
		  "and first.COUNTRY_NAME = p_country " +
		  "and first.COLUMN = 4 " +
		  "and second.CURRENT = 'Y'  " +
		  "and CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE) <=  " +
		  " 	 case when second.DATA_PERIOD_TYPE = 'MONTHLY' then  " +     
		  " 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 MONTH " +      
		  " 	 when second.DATA_PERIOD_TYPE = 'QUARTERLY' then " +      
		  " 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 3 MONTHS " +      
		  " 	 when second.DATA_PERIOD_TYPE = 'ANNUAL' then " +      
		  " 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 YEAR " +      
		  " 	 when second.DATA_PERIOD_TYPE = 'SEMI_ANNUAL' then " +      
		  " 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 6 MONTHS " +      
		  " 	 when second.DATA_PERIOD_TYPE = 'WEEKLY' then " +      
		  "	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 7 DAYS " +      
		  " 	 else CAST('1900-1-1' AS DATE) end " + 
		  "group by second.SEQUENCE, second.METRIC_CODE " +
		  ") join_table " +
		  "on current.SEQUENCE = join_table.SEQUENCE_T " + 
		  "and current.METRIC_CODE = join_table.METRIC_CODE_T " + 
		  "left join " +
		  "(select distinct SEQUENCE,METRIC_CODE,YEAR,MONTH,RATING, RANKING, COMPANY, TYPE " +
		  "	from BHMS.V_BHMS_CP_CHART_DATA " + 
		  "	where COUNTRY_NAME = p_country " +
		  ") previous  " +
		  "on join_table.SEQUENCE_T = previous.SEQUENCE " +  
		  "and join_table.METRIC_CODE_T = previous.METRIC_CODE  " +
		  "and previous.COMPANY = current.COMPANY " +
		  "and previous.TYPE = current.TYPE " +
		  "and CAST(trim(previous.YEAR)||'-'||trim(previous.MONTH)||'-01' AS DATE) = join_table.MAX_DATE " +  
		  "ORDER BY SEQUENCE, COMPANY, RANKING";

var getCPStrategicCharacteristicsByMonthStatement = "SELECT current.COMPANY AS COMPANY, " +
		  "current.DISPLAY_NAME AS DISPLAY_NAME, " +
		  "current.ICON_TEXT AS ICON_TEXT, " +
		  "current.DATA_PERIOD_TYPE AS DATA_PERIOD_TYPE, " +
		  "current.METRIC_CODE AS METRIC_CODE, " +
		  "current.OVERALL_SUM AS OVERALL_SUM, " +
		  "current.RATING AS RATING, " +
		  "current.RANKING AS RANKING, " +
		  "current.RANKING_DISPLAY AS RANKING_DISPLAY, " +
		  "current.SEQUENCE AS SEQUENCE, " +
		  "current.TYPE AS TYPE, " +
		  "current.YEAR AS YEAR, " +
		  "CURRENT.MONTH AS MONTH, " +
		  "previous.RATING as P_RATING, " +
		  "previous.RANKING as P_RANKING, " +      
		  "current.QUARTER AS QUARTER, " +
		  "current.PAGE_CHART_TYPE AS PAGE_CHART_TYPE, " +
		  "current.SAMPLE_SIZE_MESSAGE AS SAMPLE_SIZE_MESSAGE, " +
		  "current.NUMERIC_FORMAT AS NUMERIC_FORMAT, " + addDetailUrlField + 
		"from      "+
		"(select DISTINCT COLUMN, COMPANY, DISPLAY_NAME, ICON_TEXT, DATA_PERIOD_TYPE, METRIC_CODE,  " + 
		"OVERALL_SUM, RATING, RANKING, RANKING_DISPLAY, SEQUENCE, TYPE, YEAR, MONTH, " +
		"QUARTER, PAGE_CHART_TYPE, SAMPLE_SIZE_MESSAGE, NUMERIC_FORMAT, " + addDetailUrlField + 
		"	from BHMS.V_BHMS_CP_CHART_DATA " +
		"   join "+
		"   (SELECT DISTINCT MAX(CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE)) AS MAX_DATE,     "+
		"	   SEQUENCE as SEQUENCE_T,  METRIC_CODE as METRIC_CODE_T "+
		"	   FROM BHMS.V_BHMS_CP_CHART_DATA     "+
		"	   WHERE COUNTRY_NAME = p_country    "+
		"	   AND CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE) <= CAST(p_year||'-'||p_month||'-01' AS DATE)    "+
		"	   GROUP BY SEQUENCE, METRIC_CODE    "+
		"    ) TMP   "+
		"    on CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE) = TMP.MAX_DATE "+
		"    and SEQUENCE = TMP.SEQUENCE_T "+
		"    and METRIC_CODE = TMP.METRIC_CODE_T "+
		"	AND COUNTRY_NAME = p_country "+
		"	AND COLUMN = 4  " +
		"	AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y'   "+
		"	AND USER_PROFILE = p_profile) "+
		") current  "+
		"left join "+
		"(select MAX(CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE)) AS MAX_DATE,  "+
		"second.SEQUENCE AS SEQUENCE_T, second.METRIC_CODE as METRIC_CODE_T   "+
		"from BHMS.V_BHMS_CP_CHART_DATA first "+
		"join BHMS.V_BHMS_CP_CHART_DATA second "+
		"on first.SEQUENCE = second.SEQUENCE "+
		"and first.METRIC_CODE = second.METRIC_CODE "+
		"and first.COUNTRY_NAME = second.COUNTRY_NAME "+
		"and first.COLUMN = second.COLUMN "+
		"and first.COUNTRY_NAME = p_country "+
		"AND first.COLUMN = 4  " +
		"join "+
		"(SELECT DISTINCT MAX(CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE)) AS MAX_DATE,     "+
		"	 SEQUENCE,  METRIC_CODE "+
		"	 FROM BHMS.V_BHMS_CP_CHART_DATA     "+
		"	 WHERE COUNTRY_NAME = p_country "+
		"	 AND CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE) <= CAST(p_year||'-'||p_month||'-01' AS DATE)    "+
		"	 GROUP BY SEQUENCE, METRIC_CODE    "+
		") TMP   "+
		"on CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE) = TMP.MAX_DATE  "+
		"and second.SEQUENCE = TMP.SEQUENCE "+
		"and second.METRIC_CODE = TMP.METRIC_CODE "+
		"and CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE) <=  "+
		"	 case when second.DATA_PERIOD_TYPE = 'MONTHLY' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 MONTH    "+
		"	 when second.DATA_PERIOD_TYPE = 'QUARTERLY' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 3 MONTHS    "+
		"	 when second.DATA_PERIOD_TYPE = 'ANNUAL' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 YEAR    "+
		"	 when second.DATA_PERIOD_TYPE = 'SEMI_ANNUAL' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 6 MONTHS    "+
		"	 when second.DATA_PERIOD_TYPE = 'WEEKLY' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 7 DAYS    "+
		"	 else CAST('1900-1-1' AS DATE) end "+
		"group by second.SEQUENCE, second.METRIC_CODE "+
		") join_table "+
		"on current.SEQUENCE = join_table.SEQUENCE_T "+
		"and current.METRIC_CODE = join_table.METRIC_CODE_T "+
		"left join "+
		"(select distinct SEQUENCE,METRIC_CODE,YEAR,MONTH,RATING, RANKING, COMPANY, TYPE  "+
		" from BHMS.V_BHMS_CP_CHART_DATA    "+
		" where COUNTRY_NAME = p_country "+
		") previous  "+
		"on join_table.SEQUENCE_T = previous.SEQUENCE    "+
		"and join_table.METRIC_CODE_T = previous.METRIC_CODE    "+
		"and previous.COMPANY = current.COMPANY "+
		"and previous.TYPE = current.TYPE "+
		"and CAST(trim(previous.YEAR)||'-'||trim(previous.MONTH)||'-01' AS DATE) = join_table.MAX_DATE    "+
		"ORDER BY SEQUENCE, COMPANY, RANKING ";

var getDevelopersStrategicCharacteristicsCurrentStatement = "SELECT current.COMPANY AS COMPANY, " +
		  "current.DISPLAY_NAME AS DISPLAY_NAME, " +
		  "current.ICON_TEXT AS ICON_TEXT, " +
		  "current.DATA_PERIOD_TYPE AS DATA_PERIOD_TYPE, " +
		  "current.METRIC_CODE AS METRIC_CODE, " +
		  "current.OVERALL_SUM AS OVERALL_SUM, " +
		  "current.RATING AS RATING, " +
		  "current.RANKING AS RANKING, " +
		  "current.RANKING_DISPLAY AS RANKING_DISPLAY, " +
		  "current.SEQUENCE AS SEQUENCE, " +
		  "current.TYPE AS TYPE, " +
		  "current.YEAR AS YEAR, " +
		  "CURRENT.MONTH AS MONTH, " +
		  "previous.RATING as P_RATING, " +
		  "previous.RANKING as P_RANKING, " +      
		  "current.QUARTER AS QUARTER, " +
		  "current.PAGE_CHART_TYPE AS PAGE_CHART_TYPE, " +
		  "current.SAMPLE_SIZE_MESSAGE AS SAMPLE_SIZE_MESSAGE, " +
		  "current.NUMERIC_FORMAT AS NUMERIC_FORMAT, " + addDetailUrlField + 
		  "from " +
		  "(select DISTINCT COLUMN, COMPANY, DISPLAY_NAME, ICON_TEXT, DATA_PERIOD_TYPE, METRIC_CODE,  " + 
		  "OVERALL_SUM, RATING, RANKING, RANKING_DISPLAY, SEQUENCE, TYPE, YEAR, MONTH, " +
		  "QUARTER, PAGE_CHART_TYPE, SAMPLE_SIZE_MESSAGE, NUMERIC_FORMAT, " + addDetailUrlField + 
		  "	from BHMS.V_BHMS_DEVELOPER_CHART_DATA " +
		  "	WHERE  CURRENT = 'Y' " +
		  "	AND COUNTRY_NAME = p_country " + 
		  "	AND COLUMN = 4  " +
		  "	AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y'   "+
		  "	AND USER_PROFILE = p_profile) "+
		  ") current " +
		  "left join( " +
		  "select MAX(CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE)) AS MAX_DATE,  " +
		  "second.SEQUENCE AS SEQUENCE_T, second.METRIC_CODE as METRIC_CODE_T " +
		  "from BHMS.V_BHMS_DEVELOPER_CHART_DATA first " +
		  "join BHMS.V_BHMS_DEVELOPER_CHART_DATA second " +
		  "on first.SEQUENCE = second.SEQUENCE " +
		  "and first.METRIC_CODE = second.METRIC_CODE " +
		  "and first.COUNTRY_NAME = second.COUNTRY_NAME " +
		  "and first.COLUMN = second.COLUMN " +
		  "and first.COUNTRY_NAME = p_country " +
		  "and first.COLUMN = 4 " +
		  "and second.CURRENT = 'Y'  " +
		  "and CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE) <=  " +
		  " 	 case when second.DATA_PERIOD_TYPE = 'MONTHLY' then  " +     
		  " 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 MONTH " +      
		  " 	 when second.DATA_PERIOD_TYPE = 'QUARTERLY' then " +      
		  " 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 3 MONTHS " +      
		  " 	 when second.DATA_PERIOD_TYPE = 'ANNUAL' then " +      
		  " 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 YEAR " +      
		  " 	 when second.DATA_PERIOD_TYPE = 'SEMI_ANNUAL' then " +      
		  " 	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 6 MONTHS " +      
		  " 	 when second.DATA_PERIOD_TYPE = 'WEEKLY' then " +      
		  "	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 7 DAYS " +      
		  " 	 else CAST('1900-1-1' AS DATE) end " + 
		  "group by second.SEQUENCE, second.METRIC_CODE " +
		  ") join_table " +
		  "on current.SEQUENCE = join_table.SEQUENCE_T " + 
		  "and current.METRIC_CODE = join_table.METRIC_CODE_T " + 
		  "left join " +
		  "(select distinct SEQUENCE,METRIC_CODE,YEAR,MONTH,RATING, RANKING, COMPANY, TYPE " +
		  "	from BHMS.V_BHMS_DEVELOPER_CHART_DATA " + 
		  "	where COUNTRY_NAME = p_country " +
		  ") previous  " +
		  "on join_table.SEQUENCE_T = previous.SEQUENCE " +  
		  "and join_table.METRIC_CODE_T = previous.METRIC_CODE  " +
		  "and previous.COMPANY = current.COMPANY " +
		  "and previous.TYPE = current.TYPE " +
		  "and CAST(trim(previous.YEAR)||'-'||trim(previous.MONTH)||'-01' AS DATE) = join_table.MAX_DATE " +  
		  "ORDER BY SEQUENCE, COMPANY, RANKING";

var getDevelopersStrategicCharacteristicsByMonthStatement = "SELECT current.COMPANY AS COMPANY, " +
		  "current.DISPLAY_NAME AS DISPLAY_NAME, " +
		  "current.ICON_TEXT AS ICON_TEXT, " +
		  "current.DATA_PERIOD_TYPE AS DATA_PERIOD_TYPE, " +
		  "current.METRIC_CODE AS METRIC_CODE, " +
		  "current.OVERALL_SUM AS OVERALL_SUM, " +
		  "current.RATING AS RATING, " +
		  "current.RANKING AS RANKING, " +
		  "current.RANKING_DISPLAY AS RANKING_DISPLAY, " +
		  "current.SEQUENCE AS SEQUENCE, " +
		  "current.TYPE AS TYPE, " +
		  "current.YEAR AS YEAR, " +
		  "CURRENT.MONTH AS MONTH, " +
		  "previous.RATING as P_RATING, " +
		  "previous.RANKING as P_RANKING, " +      
		  "current.QUARTER AS QUARTER, " +
		  "current.PAGE_CHART_TYPE AS PAGE_CHART_TYPE, " +
		  "current.SAMPLE_SIZE_MESSAGE AS SAMPLE_SIZE_MESSAGE, " +
		  "current.NUMERIC_FORMAT AS NUMERIC_FORMAT, " + addDetailUrlField + 
		"from      "+
		"(select DISTINCT COLUMN, COMPANY, DISPLAY_NAME, ICON_TEXT, DATA_PERIOD_TYPE, METRIC_CODE,  " + 
		"OVERALL_SUM, RATING, RANKING, RANKING_DISPLAY, SEQUENCE, TYPE, YEAR, MONTH, " +
		"QUARTER, PAGE_CHART_TYPE, SAMPLE_SIZE_MESSAGE, NUMERIC_FORMAT, " + addDetailUrlField + 
		"	from BHMS.V_BHMS_DEVELOPER_CHART_DATA " +
		"   join "+
		"   (SELECT DISTINCT MAX(CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE)) AS MAX_DATE,     "+
		"	   SEQUENCE as SEQUENCE_T,  METRIC_CODE as METRIC_CODE_T "+
		"	   FROM BHMS.V_BHMS_DEVELOPER_CHART_DATA     "+
		"	   WHERE COUNTRY_NAME = p_country    "+
		"	   AND CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE) <= CAST(p_year||'-'||p_month||'-01' AS DATE)    "+
		"	   GROUP BY SEQUENCE, METRIC_CODE    "+
		"    ) TMP   "+
		"    on CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE) = TMP.MAX_DATE "+
		"    and SEQUENCE = TMP.SEQUENCE_T "+
		"    and METRIC_CODE = TMP.METRIC_CODE_T "+
		"	AND COUNTRY_NAME = p_country "+
		"	AND COLUMN = 4  " +
		"	AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y'   "+
		"	AND USER_PROFILE = p_profile) "+
		") current  "+
		"left join "+
		"(select MAX(CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE)) AS MAX_DATE,  "+
		"second.SEQUENCE AS SEQUENCE_T, second.METRIC_CODE as METRIC_CODE_T   "+
		"from BHMS.V_BHMS_DEVELOPER_CHART_DATA first "+
		"join BHMS.V_BHMS_DEVELOPER_CHART_DATA second "+
		"on first.SEQUENCE = second.SEQUENCE "+
		"and first.METRIC_CODE = second.METRIC_CODE "+
		"and first.COUNTRY_NAME = second.COUNTRY_NAME "+
		"and first.COLUMN = second.COLUMN "+
		"and first.COUNTRY_NAME = p_country "+
		"AND first.COLUMN = 4  " +
		"join "+
		"(SELECT DISTINCT MAX(CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE)) AS MAX_DATE,     "+
		"	 SEQUENCE,  METRIC_CODE "+
		"	 FROM BHMS.V_BHMS_DEVELOPER_CHART_DATA     "+
		"	 WHERE COUNTRY_NAME = p_country "+
		"	 AND CAST(trim(YEAR)||'-'||trim(MONTH)||'-01' AS DATE) <= CAST(p_year||'-'||p_month||'-01' AS DATE)    "+
		"	 GROUP BY SEQUENCE, METRIC_CODE    "+
		") TMP   "+
		"on CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE) = TMP.MAX_DATE  "+
		"and second.SEQUENCE = TMP.SEQUENCE "+
		"and second.METRIC_CODE = TMP.METRIC_CODE "+
		"and CAST(trim(first.YEAR)||'-'||trim(first.MONTH)||'-01' AS DATE) <=  "+
		"	 case when second.DATA_PERIOD_TYPE = 'MONTHLY' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 MONTH    "+
		"	 when second.DATA_PERIOD_TYPE = 'QUARTERLY' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 3 MONTHS    "+
		"	 when second.DATA_PERIOD_TYPE = 'ANNUAL' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 1 YEAR    "+
		"	 when second.DATA_PERIOD_TYPE = 'SEMI_ANNUAL' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 6 MONTHS    "+
		"	 when second.DATA_PERIOD_TYPE = 'WEEKLY' then    "+
		"	 CAST(trim(second.YEAR)||'-'||trim(second.MONTH)||'-01' AS DATE)- 7 DAYS    "+
		"	 else CAST('1900-1-1' AS DATE) end "+
		"group by second.SEQUENCE, second.METRIC_CODE "+
		") join_table "+
		"on current.SEQUENCE = join_table.SEQUENCE_T "+
		"and current.METRIC_CODE = join_table.METRIC_CODE_T "+
		"left join "+
		"(select distinct SEQUENCE,METRIC_CODE,YEAR,MONTH,RATING, RANKING, COMPANY, TYPE  "+
		" from BHMS.V_BHMS_DEVELOPER_CHART_DATA    "+
		" where COUNTRY_NAME = p_country "+
		") previous  "+
		"on join_table.SEQUENCE_T = previous.SEQUENCE    "+
		"and join_table.METRIC_CODE_T = previous.METRIC_CODE    "+
		"and previous.COMPANY = current.COMPANY "+
		"and previous.TYPE = current.TYPE "+
		"and CAST(trim(previous.YEAR)||'-'||trim(previous.MONTH)||'-01' AS DATE) = join_table.MAX_DATE    "+
		"ORDER BY SEQUENCE, COMPANY, RANKING ";

function getCPStrategicCharacteristicsCurrent(country, profile) {
	var CPStrategicCharacteristicsCurrentStatementSql = getCPStrategicCharacteristicsCurrentStatement.replace(/p_country/g, quoteWrap(country));
	CPStrategicCharacteristicsCurrentStatementSql = CPStrategicCharacteristicsCurrentStatementSql.replace(/p_profile/g, quoteWrap(profile));
	var mapping = ["COMPANY", "DISPLAY_NAME", "ICON_TEXT", "DATA_PERIOD_TYPE", "METRIC_CODE", "OVERALL_SUM", "RATING", "RANKING", 
	               "RANKING_DISPLAY", "SEQUENCE", "TYPE", "YEAR","MONTH", "P_RATING", "P_RANKING", "QUARTER", 
	               "PAGE_CHART_TYPE", "NUMERIC_FORMAT", "URL", "USER", "PW", "URL_TYPE"];
	return executeSql(CPStrategicCharacteristicsCurrentStatementSql, mapping);
}

function getCPStrategicCharacteristicsByMonth(year, month, country, profile) {
	var CPStrategicCharacteristicsByMonthStatementSql = getCPStrategicCharacteristicsByMonthStatement.replace(/p_country/g, quoteWrap(country));
	CPStrategicCharacteristicsByMonthStatementSql = CPStrategicCharacteristicsByMonthStatementSql.replace(/p_year/g, quoteWrap(year));
	CPStrategicCharacteristicsByMonthStatementSql = CPStrategicCharacteristicsByMonthStatementSql.replace(/p_month/g, quoteWrap(month));
	CPStrategicCharacteristicsByMonthStatementSql = CPStrategicCharacteristicsByMonthStatementSql.replace(/p_profile/g, quoteWrap(profile));
	var mapping = ["COMPANY", "DISPLAY_NAME", "ICON_TEXT", "DATA_PERIOD_TYPE", "METRIC_CODE", "OVERALL_SUM", "RATING", "RANKING", 
	               "RANKING_DISPLAY", "SEQUENCE", "TYPE", "YEAR","MONTH", "P_RATING", "P_RANKING", "QUARTER", 
	               "PAGE_CHART_TYPE", "NUMERIC_FORMAT", "URL", "USER", "PW", "URL_TYPE"];
	return executeSql(CPStrategicCharacteristicsByMonthStatementSql, mapping);
}

function getDevelopersStrategicCharacteristicsCurrent(country, profile) {
	var developersStrategicCharacteristicsCurrentSql = getDevelopersStrategicCharacteristicsCurrentStatement.replace(/p_country/g, quoteWrap(country));
	developersStrategicCharacteristicsCurrentSql = developersStrategicCharacteristicsCurrentSql.replace(/p_profile/g, quoteWrap(profile));
	var mapping = ["COMPANY", "DISPLAY_NAME", "ICON_TEXT", "DATA_PERIOD_TYPE", "METRIC_CODE", "OVERALL_SUM", "RATING", "RANKING", 
	               "RANKING_DISPLAY", "SEQUENCE", "TYPE", "YEAR","MONTH", "P_RATING", "P_RANKING", "QUARTER", 
	               "PAGE_CHART_TYPE", "NUMERIC_FORMAT", "URL", "USER", "PW", "URL_TYPE"];
	return executeSql(developersStrategicCharacteristicsCurrentSql, mapping);
}

function getDevelopersStrategicCharacteristicsByMonth(year, month, country, profile) {
	var developersStrategicCharacteristicsByMonthStatementSql = getDevelopersStrategicCharacteristicsByMonthStatement.replace(/p_country/g, quoteWrap(country));
	developersStrategicCharacteristicsByMonthStatementSql = developersStrategicCharacteristicsByMonthStatementSql.replace(/p_year/g, quoteWrap(year));
	developersStrategicCharacteristicsByMonthStatementSql = developersStrategicCharacteristicsByMonthStatementSql.replace(/p_month/g, quoteWrap(month));
	developersStrategicCharacteristicsByMonthStatementSql = developersStrategicCharacteristicsByMonthStatementSql.replace(/p_profile/g, quoteWrap(profile));
	var mapping = ["COMPANY", "DISPLAY_NAME", "ICON_TEXT", "DATA_PERIOD_TYPE", "METRIC_CODE", "OVERALL_SUM", "RATING", "RANKING", 
	               "RANKING_DISPLAY", "SEQUENCE", "TYPE", "YEAR","MONTH", "P_RATING", "P_RANKING", "QUARTER", 
	               "PAGE_CHART_TYPE", "NUMERIC_FORMAT", "URL", "USER", "PW", "URL_TYPE"];
	return executeSql(developersStrategicCharacteristicsByMonthStatementSql, mapping);
}

var cpDashboardTableStatement = WL.Server.createSQLStatement(
		"SELECT distinct A.metric_code, 'Action' as KEY, " +
		"'growthGapToMarket' AS SEQUENCE, " +
		"A.DISPLAY_VALUE AS DISPLAY_VALUE, A.DISPLAY_COLOR AS DISPLAY_COLOR,  " +
		"A.COMPANY AS COMPANY, A.DISPLAY_NAME AS DISPLAY_NAME, A.ICON_TEXT AS ICON_TEXT, " +
		"A.DATA_PERIOD_TYPE AS DATA_PERIOD_TYPE, A.COLUMN1_TITLE AS COLUMN1_TITLE, A.COLUMN2_TITLE AS COLUMN2_TITLE, A.COLUMN3_TITLE AS COLUMN3_TITLE, " +
		"A.YEAR AS YEAR, MONTH(A.START_DATE) as MONTH, WEEK(A.START_DATE) as WEEK ,A.START_DATE AS START_DATE " +
		"FROM V_BHMS_CP_ACTION_LIST_DATA A, " +
		"(select MAX(first.START_DATE) AS MAX_DATE, " +
		"first.SEQUENCE AS SEQUENCE_T, first.METRIC_CODE as METRIC_CODE_T " +
		"from BHMS.V_BHMS_CP_ACTION_LIST_DATA first " +
		"WHERE first.SEQUENCE =1 AND first.CURRENT = 'Y' AND  first.COUNTRY_NAME = ? " +
		"group by first.SEQUENCE, first.METRIC_CODE) B " +
		"where A.COUNTRY_NAME = ? " +
		"AND (A.CURRENT = 'Y' OR (A.CURRENT IN ('P','H') AND A.START_DATE = B.MAX_DATE - 3 MONTHS ) OR (A.CURRENT IN ('P','H') AND A.START_DATE = B.MAX_DATE - 1 YEARS )) " +
		"AND A.SEQUENCE = B.SEQUENCE_T AND A.METRIC_CODE = B.METRIC_CODE_T " +
		"AND A.SEQUENCE = 1 " +
		"and A.metric_code in (select distinct metric_code from bhms_profile_metric_security where active = 'Y' and user_profile = ?) " +
		"ORDER BY YEAR DESC, MONTH(A.START_DATE) DESC"		
);

var cpDashboardTableByMonthStatement = WL.Server.createSQLStatement(
		"SELECT distinct A.METRIC_CODE AS METRIC_CODE, 'Action' as KEY, " +
		"'growthGapToMarket' AS SEQUENCE,  " +
		"A.DISPLAY_VALUE AS DISPLAY_VALUE, A.DISPLAY_COLOR AS DISPLAY_COLOR,   " +
		"A.COMPANY AS COMPANY, A.DISPLAY_NAME AS DISPLAY_NAME, A.ICON_TEXT AS ICON_TEXT,  " +
		"A.DATA_PERIOD_TYPE AS DATA_PERIOD_TYPE, A.COLUMN1_TITLE AS COLUMN1_TITLE, A.COLUMN2_TITLE AS COLUMN2_TITLE, A.COLUMN3_TITLE AS COLUMN3_TITLE,  " +
		"YEAR, MONTH(A.START_DATE) as MONTH, WEEK(A.START_DATE) as WEEK  " +
		"FROM V_BHMS_CP_ACTION_LIST_DATA A , (SELECT DISTINCT MAX(START_DATE) AS MAX_DATE, COLUMN AS COLUMN_T   " +
		"FROM V_BHMS_CP_ACTION_LIST_DATA  " +
		"WHERE COUNTRY_NAME = ? " +
		"AND SEQUENCE = 1  " +
		"AND TO_NUMBER(TRIM(YEAR)||LPAD(TRIM(LTRIM(MONTH(START_DATE),0)), 2, '0')) <= TO_NUMBER(?||LPAD(?, 2, '0'))   " +
		"GROUP BY COLUMN,SEQUENCE) TMP   " +
		"WHERE A.COUNTRY_NAME = ? " +
		"AND (A.START_DATE = TMP.MAX_DATE OR A.START_DATE = TMP.MAX_DATE - 3 MONTHS OR A.START_DATE = TMP.MAX_DATE - 1 YEARS) " +
		"AND COLUMN = TMP.COLUMN_T  " +
		"AND SEQUENCE = 1   " +
		"AND METRIC_CODE IN (SELECT DISTINCT METRIC_CODE FROM BHMS_PROFILE_METRIC_SECURITY WHERE ACTIVE = 'Y' AND USER_PROFILE = ?) " +
		"ORDER BY YEAR DESC, MONTH(A.START_DATE) DESC"
		);

function getCPDashboardTableCurrent(country, profile) 
{	
	return invokeCpActionOutComeListBeFormat(WL.Server.invokeSQLStatement({
		preparedStatement : cpDashboardTableStatement,
		parameters : [country, country, profile]
	}));
}

function getCPDashboardTableByMonth(country, year, month, profile) 
{	
	return invokeCpActionOutComeListBeFormat(WL.Server.invokeSQLStatement({
		preparedStatement : cpDashboardTableByMonthStatement,
		parameters : [country, year, month, country, profile]
	}));
}

function invokeCpActionOutComeListBeFormat(resultData) {
	var returnValue = {};
	var tmp = null;

	for (x in resultData.resultSet) {
		tmp = resultData.resultSet[x];

		if (!returnValue[tmp['SEQUENCE']]) {
			returnValue[tmp['SEQUENCE']] = {
				// xmt 2015.6.19 10:37
				detailurl:tmp['URL'],
				user_name:tmp['USER'],
				password:tmp['PW'],
				urlType:tmp['URL_TYPE'],
				bshow: tmp['URL']==null || tmp['URL']=="" ? false : true,
				szshow:true,	
				metricCode: tmp['METRIC_CODE'],

				ratingColor: (tmp['DISPLAY_COLOR'] != null)?tmp['DISPLAY_COLOR']:"Grey",
				pratingColor: tmp['P_RATING'],
				pdisplayShow : tmp['P_RATING'] != null,

				tableTitle: tmp['DISPLAY_NAME'],
				icon: tmp['ICON_TEXT'],
				period: tmp['DATA_PERIOD_TYPE'].charAt(0).toUpperCase() + tmp['DATA_PERIOD_TYPE'].substr(1).toLowerCase(),
				range: _getPeriodText(tmp['DATA_PERIOD_TYPE'], tmp['MONTH'], tmp['YEAR'], tmp['WEEK']),
				caption: null,
				data: [],
				chartType : 'table'
			};

			//build titles
			returnValue[tmp['SEQUENCE']].titles = [];
			for (var x = 1; x <= 4; x++) {
				if ((tmp['COLUMN' + x + '_TITLE'] != null) && (tmp['COLUMN' + x + '_TITLE'] != "")) {
					returnValue[tmp['SEQUENCE']].titles.push(tmp['COLUMN' + x + '_TITLE']);
				}
			}
		}

		if (tmp['SAMPLE_SIZE_MESSAGE'] != null || tmp['SAMPLE_SIZE_ANALYTICS'] != null || tmp['SAMPLE_SIZE_COGNITIVE'] != null 
			|| tmp['SAMPLE_SIZE_CLOUD'] != null || tmp['SAMPLE_SIZE_MOBILE'] != null || tmp['SAMPLE_SIZE_SOCIAL'] != null 
			|| tmp['SAMPLE_SIZE_SECURITY'] != null || tmp['SAMPLE_SIZE_LOB'] != null || tmp['SAMPLE_SIZE_IT'] != null 
			|| tmp['SAMPLE_SIZE_CLIENT'] != null || tmp['SAMPLE_SIZE_PROSPECT'] != null) 
			returnValue[tmp['SEQUENCE']].caption = {sampleSizeMessage : tmp['SAMPLE_SIZE_MESSAGE'], 
		                                            sampleSizeAnalytics : tmp['SAMPLE_SIZE_ANALYTICS'],
		                                            sampleSizeCognitive : tmp['SAMPLE_SIZE_COGNITIVE'],
		                                            sampleSizeCloud : tmp['SAMPLE_SIZE_CLOUD'],
		                                            sampleSizeMobile : tmp['SAMPLE_SIZE_MOBILE'],
		                                            sampleSizeSocial : tmp['SAMPLE_SIZE_SOCIAL'],
		                                            sampleSizeSecurity : tmp['SAMPLE_SIZE_SECURITY'],
		                                            sampleSizeLOB : tmp['SAMPLE_SIZE_LOB'],
		                                            sampleSizeIT : tmp['SAMPLE_SIZE_IT'],
		                                            sampleSizeClients : tmp['SAMPLE_SIZE_CLIENT'],
		                                            sampleSizeProspects : tmp['SAMPLE_SIZE_PROSPECT']
													};
		returnValue[tmp['SEQUENCE']].data.push(['IBM', _getPeriodText(tmp['DATA_PERIOD_TYPE'], tmp['MONTH'], tmp['YEAR'], tmp['WEEK']), tmp['DISPLAY_VALUE']]);
			
	}

	// this should not be necessary, but 500 error is thrown otherwise
	returnValue = JSON.stringify(returnValue);
	returnValue = JSON.parse(returnValue);

	return { listValues: returnValue };
} 

var getUpdateBannerContentStatement = WL.Server.createSQLStatement(
		"UPDATE " +
		"BHMS.COUNTRY_BANNER " +
		"SET BANNER_CONTENT = ? " +
	"WHERE BLUEPAGE = ? " +
	"AND COUNTRY_NAME = ? "
);
function setBannerContent(country, text, blueGroup){
	return WL.Server.invokeSQLStatement({
		preparedStatement : getUpdateBannerContentStatement,
		parameters : [text, blueGroup, country]
	});
}
var getSelectBannerContentStatement = WL.Server.createSQLStatement(
		"SELECT " +
		"BANNER_CONTENT " +
		"FROM BHMS.COUNTRY_BANNER " +
	"WHERE BLUEPAGE = ? " +
	"AND COUNTRY_NAME = ? "
);
function getBannerContent(country, blueGroup){
	return WL.Server.invokeSQLStatement({
		preparedStatement : getSelectBannerContentStatement,
		parameters : [blueGroup, country]
	});
}