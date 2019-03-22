define(['BrandEdge/app'], function(app) 
{
	/**
	 *   Bar Chart Directive
	 *   
	 *    		This directive makes bar charts using d3 an the ChartService.
	 *    
	 *  inputs
	 *  
	 *    beBarChart* - indicates whether or not the chart will be a bar graph or a stacked bar chart.  This is also the directive that must be specified to trigger this directive
	 *    
	 *    		valid values:
	 *    
	 *    				bar - Bar chart to be generated with data elements as follows:
	 *    
	 *    							series [ { name: company name, value: value } ]
	 *    
	 *    				stackedBar - Brand Edge specific stacked bar chart for 3 values.  each data element pased in the series should be structured as:
	 *    
	 *    							series [ { name: company name, positiveValue: value, neutralValue: value, negativeValue } ]
	 *    
	 * 	  beChartWidth* - specifies the width of the chart in pixels.  If this directive is applied to a block level element like a div, then this will be take from the dimensions of the div.
	 * 
	 * 	  beChartHeight* - specifies the height of the chart in pixels.  If this directive is applied to a block level element like a div, then this will be take from the dimensions of the div.
	 * 
	 *    beChartData* - chart data element formatted as shown with series as described above 
	 *    
	 *    			{
	 *    				series: array as shown above, 
	 *    				
	 *    				margin: margin (HTML style margin percentage)
	 *    
	 *    			}
	 *    
	 *     beChartValues* - array of data points for standard deviation & rating determinations
	 *      
	 *     beChartPercentVisible - true/false flag to indicate whether or not y-axis values should display % behind the values ( default: false )
	 *     
	 *     beChartXlabelsVisible - true/false flag to indicate whether or not company names should be displayed on the x-axis ( default: true )
	 *   
	 *     beChartYticksVisible - true/false flag to indicate whether or no tick marks should be shown on the y-axis ( default: true ) 
	 *   
	 *     beChartDisableTooltips - true/false flag to allow disabling of hover tooltips ( default: false ) 
	 *     
	 *     beOptionFlags - JSON format objects allowing the setting of the true false options as follows:
	 *     
	 *     			{
	 *     				chartPercentVisible: value,
	 *     				chartXlabelsVisible: value,
	 *     				chartYticksVisible: value,
	 *     				chartDisableTooltips: value
	 *     			}
	 *  
	 *  returns
	 *   
	 *     beChartRating - rating object to be returned when chart rendering is complete, structured as follows:
	 *     
	 *      		{
	 *      			IBM: value,
	 *      			yellowStart: value,
	 *      			greenStart: value
	 *      		}
	 *      
	 *      	** In the future, this may be changed to a 1,2,3 rating, but the current definition is
	 *      
	 *      			if IBM value < yellowStart = Red
	 *      			if IBM value > greenStart = Green
	 *      			else = Yellow
	 *      
	 */
	app.directive('beChicklet', function() 
	{
	  'use strict';
	  
	  return {
	    restrict: 'A',
	    priority: 10,
	    //replace: true,
	    template: function(element, attrs) 
	    {	
	    	var output = "";
	    	
	    	if ((attrs.beChicklet == "bar") || (attrs.beChicklet == "stackedBar"))
	    	{
//	    		console.log("Chicklet",attrs.beChicklet);
	    		element.css('width', "100%");
	    		element.css('height', "100%");
		    	output = "<div style=\"text-overflow: ellipsis; overflow: hidden; \">" +
		    				"<div><div><div data-ng-bind-html=\"" + attrs.beRating + " | rating\"></div> " + attrs.beChickletTitle + "</div>" +
							"<div>" + attrs.beChickletPeriod + "</div></div></div>" +
							"<div><div>" + (attrs.beChickletRange?attrs.beChickletRange:"") + "</div></div>" +
							"<div><div" + (attrs.beChickletSortClick?(" ng-click=\"" + attrs.beChickletSortClick + "()\""):"") + "><img src=\"images/icons/options@1x.png\"/></div></div>" +
							"<div style=\"width:100%; height: 80%;\" data-be-bar-chart=\"" + attrs.beChicklet + "\"";
		    	
		    	if (attrs.beChartWidth != null)
		    	{
		    		output += " data-be-chart-width=\"" + attrs.beChartWidth + "\"";
		    	}
		    	
		    	if (attrs.beChartHeight != null)
		    	{
		    		output += " data-be-chart-height=\"" + attrs.beChartHeight + "\"";
		    	}
		    	
		    	if (attrs.beChartData != null)
		    	{
		    		output += " data-be-chart-data=\"" + attrs.beChartData + "\"";
		    	}
		    	
		    	if (attrs.beChartValues != null)
		    	{
		    		output += " data-be-chart-values=\"" + attrs.beChartValues + "\"";
		    	}
		    	
		    	if (attrs.beChartPercentVisible != null)
		    	{
		    		output += " data-be-chart-percent-visible=\"" + attrs.beChartPercentVisible + "\"";
		    	}
		    	
		    	if (attrs.beChartXlabelsVisible != null)
		    	{
		    		output += " data-be-chart-xlabels-visible=\"" + attrs.beChartXlabelsVisible + "\"";
		    	}
		    	
		    	if (attrs.beChartYticksVisible != null)
		    	{
		    		output += " data-be-chart-yticks-visible=\"" + attrs.beChartYticksVisible + "\"";
		    	}
		    	
		    	if (attrs.beChartDisableTooltips != null)
		    	{
		    		output += " data-be-chart-disable-tooltips=\"" + attrs.beChartDisableTooltips + "\"";
		    	}
		    	
		    	if (attrs.beChartValueKey != null)
		    	{
		    		output += " data-be-chart-value-key=\"" + attrs.beChartValueKey + "\"";
		    	}
		    	
		    	if (attrs.beRating != null)
		    	{
		    		output += " data-be-chart-rating=\"" + attrs.beRating + "\"";
		    	}
				
		    	output += "></div>";
	    	}
	    	else if (attrs.beChicklet == "table")
	    	{
	    		output = "<div style=\"text-overflow: ellipsis; overflow: hidden; " + ((attrs.beChartWidth != null)?("width: " + attrs.beChartWidth + "px;"):"") + "\">" +
				"<div><div><div data-ng-bind-html=\"" + attrs.beRating + " | rating\"></div> " + attrs.beChickletTitle + "</div>" +
				"<div>" + attrs.beChickletPeriod + "</div></div></div>" +
				"<div><div>" + (attrs.beChickletRange?attrs.beChickletRange:"") + "</div></div>" +
				"<data-be-table data-be-data=\"" + attrs.beData + "\"";
	    		
	    		if (attrs.beWidth != null)
		    	{
		    		output += " data-be-width=\"" + attrs.beWidth + "\"";
		    	}
		    	
	    		if (attrs.beHeight != null)
		    	{
		    		output += " data-be-height=\"" + attrs.beHeight + "\"";
		    	}
	    		
	    		if (attrs.beMargin != null)
		    	{
		    		output += " data-be-margin=\"" + attrs.beMargin + "\"";
		    	}
		    	
		    	if (attrs.beAlternateRows != null)
		    	{
		    		output += " data-be-alternate-rows=\"" + attrs.beAlternateRows + "\"";
		    	}
		    	
		    	output += "></data-be-table>";
	    	}
	    	
	    	function setVisibility()
	    	{
	    		if (eval('scope.' + attrs.beVisibilityTest))
	    		{
	    			element.attr('class','cp-graph-block');
	    			element.removeClass('be-hidden');
	    		}
	    		else
	    		{
	    			element.removeClass('cp-graph-block');
	    			element.attr('class','be-hidden');
	    		}
	    	}
	    	
            
	    	var scope = element.scope();
	    	scope.$watch(function(scope) { return eval('scope.' + attrs.beVisibilityTest); }, setVisibility, true);
	    	
	    	return output;
	    } 
	  };
	});
});