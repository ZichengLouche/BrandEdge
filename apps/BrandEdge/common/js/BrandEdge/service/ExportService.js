define(['BrandEdge/app', 'lib/d3/d3' ], function(app) {
	app.service('ExportService', function($state, $timeout, CustomMath, Utility,DataUtility) {
		var landscapeConfig = {
				pdfHeight : 207,
				pdfWidth: 297,
				chartSpace : 2,
				chartStartX : 10,
				chartStartY : 10,
				column1 : {
					chartHeight : 80,
					chartWidth : 100,
				},
				column2 : {
					chartHeight : 60,
					chartWidth : 80,
				},
				column3 : {
					chartHeight : 60,
					chartWidth : 80,
				},
		};
		var portraitConfig = {
				pdfHeight : 297,
				pdfWidth: 207,
				chartSpace : 2,
				chartStartX : 10,
				chartStartY : 10,
				column1 : {
					chartHeight : 80,
					chartWidth : 100,
				},
				column2 : {
					chartHeight : 60,
					chartWidth : 80,
				},
				column3 : {
					chartHeight : 40,
					chartWidth : 60,
				},
		};

		var columns = 1;
		var chartNamelist = [];
		var constituent = "";
		var segment = "";
		var country = "";
		var engagement = "";
		var pdfName = "";
		var isLandScape = false;
		var exs = this;
		
		exs.setConstituent = function(c) {
			exs.constituent = c;
		};
		exs.setSegment = function(s) {
			exs.segment = s;
		};
		exs.setCountry = function(cou) {
			exs.country = cou;
		};
		exs.setEngagement = function(e) {
			exs.engagement = e;
		};
		exs.setPDFName= function(pdfname) {
			exs.pdfName = pdfname;
		};
		exs.setColumn= function(col) {
			exs.columns = col;
		};
		exs.setIsLandScape= function(lds) {
			exs.isLandScape = lds;
		};

		exs.isNeedExportChart = function(chartName) {
			var bret = false;
			for (var i = 0; i < exs.chartNamelist.length; i++) {
				if (exs.chartNamelist[i] === chartName) {
					bret = true;
					break;
				}
			}
			return bret;
		};

		exs.setCurExportChartNamelist = function(chtNamelist) {
			exs.chartNamelist = chtNamelist;
		};

		exs.getChartOtherInfo = function() {
			var curConstituent = $("#constituentId li.ng-scope.active a").text();
			var curSegment;
			var curEngagement;

			switch (curConstituent) {
			case "Clients & Prospects": {
				var cloneSegmentNode = $("#clientProspectId div div.dropdown.active2 div").clone();
				cloneSegmentNode.children().remove();
				curSegment = cloneSegmentNode.text();

				if (curSegment === "") {
					curSegment = $("#clientProspectId div div.active :first").text();
				}

				curEngagement = $("#clientProspectId div div.active :last").text();
				break;
			}
			case "Influencers": {
				var cloneSegmentNode = $("#influencersId div div.dropdown.active2 div").clone();
				cloneSegmentNode.children().remove();
				curSegment = cloneSegmentNode.text();

				if (curSegment === "") {
					curSegment = $("#influencersId div div.active :first").text();
				}

				curEngagement = $("#influencersId div div.active :last").text();
				break;
			}
			case "Developers": {
				curSegment = $("#developerId div.active :first").text();
				curEngagement = $("#developerId div.active :last").text();
				break;
			}
			case "Strategic Brand Attributes": {
				curSegment = $("#strategicId div.active :first").text();
				curEngagement = $("#strategicId div.active :last").text();
				break;
			}
			case "Employees":
				break;
			}

			var curCountry = DataUtility.getCountry();
			var strResult = "constituent: " + curConstituent + "\r\n segment: " + curSegment + "\r\n engagement: " + curEngagement;

			exs.setCountry(curCountry==null?"":curCountry.country);
			exs.setSegment(curSegment);
			exs.setEngagement(curEngagement);

			if(curSegment && curEngagement){
				strResult = curCountry==null?"":curCountry.country + "-" + curConstituent + "-" + curSegment + "-" + curEngagement;
			}else{
				strResult = curCountry==null?"":curCountry.country + "-" + curConstituent + "-view";
			}
			
			if(exs.constituent != 'WW/IOT Beta'){
				strResult = curCountry==null?"":curCountry.country + "-" + curConstituent + "-" + curSegment + "-" + curEngagement;
			}else{
				strResult = 'WW-IOT-view';
			}
			
			exs.setPDFName(strResult);
		};

		exs.exportAllCharts = function() {
			var list = new Array();
			var titleArray = new Array();
			switch (exs.constituent) {
				case "WW/IOT Beta": {
					//var items = $(".row");
					$("#backupDiv").empty();
					$("#backupDiv").css("display", "block");
					var items = $("#backupDiv").append($(".row").clone());
					$("#backupDiv .row").css("margin-right","-35px");
					$("#backupDiv .row").css("margin-left","-35px");
					list.push(items);
					break;
				}
				case "Clients & Prospects": {
					var items = $(".col-lg-4");
					for (var i=0;i<items.length;i++) {
						var item = items[i];
						if (typeof item.children[0].children[0].children[0].children[0] != "undefined") {
							var chartTitle = item.children[0].children[0].children[0].children[0].children[0].textContent;
							var bIsNeedExport = exs.isNeedExportChart(chartTitle);
							if(bIsNeedExport) {
								list.push(item);
								titleArray.push(chartTitle);
							}
						}
					}
					break;
				}
				case "Influencers":
				case 'Strategic Brand Attributes':
				case "Developers": {
					var items = $(".col-lg-4");
					for (var i=0;i<items.length;i++) {
						var item = items[i];
						if (typeof item.children[0].children[0].children[0].children[0] != "undefined") {
							var chartTitle = item.children[0].children[0].children[0].children[0].children[1].innerHTML;
							var bIsNeedExport = exs.isNeedExportChart(chartTitle);
							if(bIsNeedExport)
							{
								list.push(item);
								titleArray.push(chartTitle);
							}
						}
					}
					break;
				}
				case "Employees": {
					break;
				}
			}

			var svglist = d3.selectAll("svg")[0];
			var svglistResult = new Array();
			var titleSvgMap = {};
			for(var index = 0;index<svglist.length;index++) {
				var nextChartTitle ;
				var svgItem = svglist[index];
				switch (exs.constituent) {
					case "Influencers": 
					case 'Strategic Brand Attributes':
					case "Developers": {
						nextChartTitle = svgItem.parentNode.parentNode.parentNode.children[0].children[0].children[1].innerHTML;
					}
					break;
					case "Clients & Prospects": {
						nextChartTitle = svgItem.parentNode.parentNode.children[0].children[0].children[0].children[0].textContent;
					}
					break;
				}
				
				var bIsNeedExport = exs.isNeedExportChart(nextChartTitle);
				if(bIsNeedExport) {
					svglistResult.push(svgItem);
					titleSvgMap[nextChartTitle] = svgItem;
				}
			}
			
			exs.getChartOtherInfo();
			var config = {};
			var doc;
			if (exs.isLandScape === 'true') {
				config.pdfHeight = landscapeConfig.pdfHeight;
				config.pdfWidth = landscapeConfig.pdfWidth;
				config.chartSpace = landscapeConfig.chartSpace;
				config.chartStartX = landscapeConfig.chartStartX;
				config.chartStartY = landscapeConfig.chartStartY;
				config.chartHeight = landscapeConfig['column' + exs.columns].chartHeight;
				config.chartWidth = landscapeConfig['column' + exs.columns].chartWidth;

				doc = new jsPDF('landscape');
			}
			else {
				config.pdfHeight = portraitConfig.pdfHeight;
				config.pdfWidth = portraitConfig.pdfWidth;
				config.chartSpace = portraitConfig.chartSpace;
				config.chartStartX = portraitConfig.chartStartX;
				config.chartStartY = portraitConfig.chartStartY;
				config.chartHeight = portraitConfig['column' + exs.columns].chartHeight;
				config.chartWidth = portraitConfig['column' + exs.columns].chartWidth;

				doc = new jsPDF();
			}

			//Hide all svg text before draw html
			for (var k in svglistResult) {
				$(svglistResult[k]).find('text').each(function(){
					$(this).hide();
				})
			}
			exs.export(list, svglistResult, titleArray, titleSvgMap, doc, 0, 0, exs, config);
			
		}
		
		exs.export = function(list, svglist, titleArray, titleSvgMap, doc, index, svgIndex, exs, config) {
			if (index >= list.length) {
				return;
			}
			
			var item;
			if(exs.constituent == 'WW/IOT Beta'){
				var bb = list[index][0].childNodes;
				item = list[index][0].childNodes[0];
			}else{
				item = list[index];
			}
			
			var title = titleArray[index];
			var svgItem = titleSvgMap[title];

			html2canvas(item, {
				background : "#fff",
				onrendered : function(canvas) {
					if (index == 0) {
						doc.setFontSize(8);
						doc.setTextColor(0);
						if(exs.constituent != 'WW/IOT Beta'){
							doc.text(config.chartStartX, 5, exs.country + ' - ' + exs.constituent + ' - ' + exs.segment + ' - ' + exs.engagement);
						}else{
							doc.text(config.chartStartX, 5, 'WW/IOT Consolidated Score Dashboard view');
						}
					}

					var pageItemHeight = config.chartHeight + config.chartSpace;
					var pageChartCount = parseInt(config.pdfHeight - config.chartStartY) / parseInt(pageItemHeight);
					pageChartCount = parseInt(pageChartCount);

					if (index > pageChartCount - 1 && index % (pageChartCount*exs.columns) == 0) {
						doc.setFontSize(8);
						doc.setTextColor(0);
						doc.text(config.chartStartX, config.pdfHeight - 4, '*IBM Confidential');
						doc.addPage();

						doc.setFontSize(8);
						doc.setTextColor(0);
						if(exs.constituent != 'WW/IOT Beta'){
							doc.text(config.chartStartX, 5, exs.country + ' - ' + exs.constituent + ' - ' + exs.segment + ' - ' + exs.engagement);
						}else{
							doc.text(config.chartStartX, 5, 'WW/IOT Consolidated Score Dashboard view');
						}
						
					}
						
					var dataUrl = canvas.toDataURL("image/jpeg");
					var htmlImage = new Image();
					htmlImage.src = dataUrl;
					
					if(exs.constituent=="WW/IOT Beta"){ 
						/*
						//Put all elements in a page with correct format.
						var imageH = item[0].clientHeight;
						var pageCount = parseInt(canvas.height/imageH);
						for(var i=0;i<pageCount;i++){
							if(i!=0){
								doc.addPage();
							}
							doc.addImage({
								imageData : htmlImage,
								format : 'JPEG',
								x : config.chartStartX + (index % exs.columns) * (config.chartWidth + config.chartSpace),
								y : -config.pdfHeight * i -config.chartStartY+ (config.chartHeight + config.chartSpace) * ( ((index - index % exs.columns)/exs.columns) % pageChartCount) ,
								w : config.pdfWidth,
								h : config.pdfHeight
							});
						}*/
						
						/*
						//Put all elements into multi-pages with un-normal format
						var pageCount = parseInt(canvas.height/config.pdfHeight);
						for(var i=0;i<pageCount;i++){
							if(i!=0){
								doc.addPage();
							}
							doc.addImage({
								imageData : htmlImage,
								format : 'JPEG',
								x : 0,
								y : -config.pdfHeight*i,
								w : canvas.width,
								h : canvas.height
							});
						}*/
						
						//Put all elements into multi-pages with correct format
						var imageH = item.clientHeight/4 - config.chartStartY;
						var pageCount = Math.ceil(imageH/config.pdfHeight);
						for(var i=0;i<pageCount;i++){
							if(i!=0){
								doc.addPage();
							}
							doc.addImage({
								imageData : htmlImage,
								format : 'JPEG',
								x : config.chartStartX + (index % exs.columns) * (config.chartWidth + config.chartSpace),
								y : -config.pdfHeight*i,
								w : exs.isLandScape==='true'?item.clientWidth/5:item.clientWidth/7,
								h : imageH
							});
						}
					}else {
						doc.addImage({
							imageData : htmlImage,
							angle : 0,
							x : config.chartStartX + (index % exs.columns) * (config.chartWidth + config.chartSpace),
							y : config.chartStartY+ (config.chartHeight + config.chartSpace) * ( ((index - index % exs.columns)/exs.columns) % pageChartCount),
							w : config.chartWidth,
							h : config.chartHeight
						});
					}
					
					var nextindex;
					var nextsvgindex;
					if (typeof svgItem != 'undefined') {
						$(item).find('text').each(function(){
							$(this).show();
						})
						
						// xmt 2015.7.3 17:46
						var svgItemClone = $(svgItem).clone();
						svgItemClone.find('text').each(function(){
							$(this).removeAttr("font-family");
							$(this).css("font-family","Arial");
							$(this).css("font-style","normal");
							$(this).css("font-weight","normal");
							$(this).css("font-size","10px");
						})
						
						nextsvgindex = svgIndex + 1;
						var itemWidth = svgItem.width.baseVal.value;
						var itemHeight = svgItem.height.baseVal.value;
						
						var imgItem = new Image();
						var serializer = new XMLSerializer();
						var svgStr = serializer.serializeToString(svgItemClone[0]);
						imgItem.src = 'data:image/svg+xml;base64,' + window.btoa(svgStr);
						var canvas = document.createElement("canvas");
						canvas.width = itemWidth;
						canvas.height = itemHeight;
						var ctx = canvas.getContext("2d");
						
						imgItem.onload = function() {
							ctx.drawImage(imgItem, 0, 0, itemWidth, itemHeight);
							var svgImage = new Image();
							svgImage.src = canvas.toDataURL();
							
							var svgoffsetY = 0.2;
							var svgheightCut = 0.25;
							if (exs.constituent != 'Clients & Prospects') {
								svgheightCut = svgheightCut + 0.1;
								svgoffsetY = svgoffsetY + 0.05;
							}
							doc.addImage({
								imageData : svgImage,
								angle : 0,
								x : config.chartStartX + config.chartWidth * 0.08 + (index % exs.columns) * (config.chartWidth + config.chartSpace),
								y : config.chartStartY + config.chartHeight * svgoffsetY  + (config.chartHeight + config.chartSpace) * (((index - index % exs.columns)/exs.columns) % pageChartCount),
								w : config.chartWidth - config.chartWidth * 0.2,
								h : config.chartHeight - config.chartHeight * svgheightCut
							});
							
							if (svgIndex == svglist.length -1 && svgIndex == list.length -1) {
								doc.setFontSize(8);
								doc.setTextColor(0);
								doc.text(config.chartStartX, config.pdfHeight - 4, '*IBM Confidential');

								var pdfFileName = exs.pdfName + ".pdf";
								doc.save(pdfFileName);
							} else {
								nextindex = index + 1;
								exs.export(list, svglist, titleArray, titleSvgMap, doc, nextindex, nextsvgindex, exs, config);
							}
						}
					} else {
						if (index == list.length -1) {
							doc.setFontSize(8);
							doc.setTextColor(0);
							doc.text(config.chartStartX, config.pdfHeight - 4, '*IBM Confidential');

							var pdfFileName = exs.pdfName + ".pdf";
							
							var timer = $timeout(
		                        function() {
		                        	doc.save(pdfFileName);
		                        },
		                        1000
		                    );
		                    timer.then(
		                        function() {
		                            console.log( "Save PDF resolved!", Date.now() );
		                        },
		                        function() {
		                            console.log( "Save PDF rejected!", Date.now() );
		                        }
		                    );
							
							$("#backupDiv").css("display", "none");
						}
						nextindex = index + 1;
						exs.export(list, svglist, titleArray, titleSvgMap, doc, nextindex, nextsvgindex, exs, config);
					}
				}
			});
		}
		
		exs.exportWWIOTView = function(){
			
		}
		
	});
});