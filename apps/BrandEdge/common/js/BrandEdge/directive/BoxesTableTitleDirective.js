define(
		[ 'BrandEdge/app' ],
		function(app) {
			/**
			 * Specify this directive as an tooltip anywhere you want to display
			 * on realTime. Any username and password set in the message will
			 * appear.
			 */
			app.directive('beTableTitle',function($compile, $window) {

								return {
									restrict : 'EA',
									replace : false,
									transclude : true,
									scope : {
										beConstituent : '=',
										isAdditional : '=',
										beTitleName : '@',
										beDataSetting : '='
										
									},

									link : function(scope, elem, attrs) {

										scope.childToggle = function(
												isConstituent, name, toOpen,
												country) {
											expandObj = {
												isConstituent : isConstituent,
												name : name,
												toOpen : toOpen,
												country : country
											};
											scope.$emit('partialExpand',
													expandObj);
										}

										function update() {
											if (typeof scope.beConstituent === 'undefined'
													|| scope.beConstituent == null)
												return;

											var htmlValue = "";
											htmlValue += "<table class='";
											htmlValue += scope.isAdditional?'layout':'title-layout';
											htmlValue+= "'> ";
											// Grey out Employee Information
//											htmlValue += "<caption class='title'><span>{{beConstituent.constituent}}</span><br><span style='font-weight: normal;font-size: 1rem;' ng-if=\"beConstituent.constituent == 'Employees'\">(Please consult with HR regarding IBMer metrics)</span></caption> ";
											htmlValue += "<thead> ";
											htmlValue += "<tr> ";
											// htmlValue += (attrs.beBoxesTable
											// == '0' ||
											// scope.isAdditional)?"<th
											// class='country'></th> ":"";
											// htmlValue += (false)?"<th
											// class='country'></th> ":"";
											htmlValue += !scope.beConstituent.isOpen ? "<th class='extendDetail'>Brand Health Score &nbsp<a class='icon-open' data-ng-click='childToggle(true, beConstituent.constituent, true)'></a></th> "
													: "";
											htmlValue += scope.beConstituent.isOpen ? "<th class='firstBoldDetail'>BHS &nbsp<a class="
													+ "'icon-close' data-ng-click='childToggle(true, beConstituent."
													+ "constituent, false)'></a></th> "
													: "";

											// xmt 2015.9.15 10:57
											if (typeof scope.beConstituent.rows[0].children[0] !== 'undefined') {
												for ( var x in scope.beConstituent.rows[0].children[0].segments) {
													if (scope.beConstituent.isOpen
															&& scope.beDataSetting.stages[scope.beConstituent.rows[0].children[0].segments[x].metrics[0].displayName
																	.split(' ')[0]
																	.toLowerCase()]) {
														htmlValue += "<th class='boldDetail'> ";
														htmlValue += "<table class='subtable'> ";
														htmlValue += "<tr> ";
														for ( var y in scope.beConstituent.rows[0].children[0].segments[x].metrics) {
															htmlValue += (y == 0) ? "<th class='boldDetail'>{{beConstituent.rows[0].children[0].segments["
																	+ x
																	+ "].metrics["
																	+ y
																	+ "].displayName.split(' ')[0]}}</th> "
																	: scope.isAdditional ? "<th class='boldDetail'></th> "
																			: "";
														}
														htmlValue += "</tr> ";
														htmlValue += "</table> ";
														htmlValue += "</th> ";
													}
												}
											} else {
												for ( var x in scope.beConstituent.rows[1].children[0].segments) {
													if (scope.beConstituent.isOpen
															&& scope.beDataSetting.stages[scope.beConstituent.rows[1].children[0].segments[x].metrics[0].displayName
																	.split(' ')[0]
																	.toLowerCase()]) {
														htmlValue += "<th class='boldDetail'> ";
														htmlValue += "<table class='subtable'> ";
														htmlValue += "<tr> ";
														for ( var y in scope.beConstituent.rows[1].children[0].segments[x].metrics) {
															htmlValue += (y == 0) ? "<th class='boldDetail'>{{beConstituent.rows[1].children[0].segments["
																	+ x
																	+ "].metrics["
																	+ y
																	+ "].displayName.split(' ')[0]}}</th> "
																	: scope.isAdditional ? "<th class='boldDetail'></th> "
																			: "";
														}
														htmlValue += "</tr> ";
														htmlValue += "</table> ";
														htmlValue += "</th> ";
													}
												}
											}

											htmlValue += "</tr> ";
											htmlValue += "</thead> ";
											htmlValue += scope.beConstituent.isOpen ? "<tr border='0'> "
													: "";
											// htmlValue += (attrs.beBoxesTable
											// == '0' || scope.isAdditional) ?
											// "<th class='country'></th> " :
											// "";
											// htmlValue += (false) ? "<th
											// class='country'></th> " : "";
											if (typeof scope.beConstituent.rows[0].children[0] !== 'undefined') {
												htmlValue += (scope.beConstituent.constituent == 'Employees') ? "<th class='detail'>{{beDataSetting.segmentation == 'allover' ? beConstituent.rows[0].children[0].scores.shortName : beConstituent.rows[0].children[0].scores.camsShortName}}</th> "
														: "<th class='detail'></th> ";
											} else {
												htmlValue += (scope.beConstituent.constituent == 'Employees') ? "<th class='detail'>{{beDataSetting.segmentation == 'allover' ? beConstituent.rows[1].children[0].scores.shortName : beConstituent.rows[1].children[0].scores.camsShortName}}</th> "
														: "<th class='detail'></th> ";
											}
											if (scope.beConstituent.isOpen) {
												if (typeof scope.beConstituent.rows[0].children[0] !== 'undefined') {
													for ( var x in scope.beConstituent.rows[0].children[0].segments) {
														if (scope.beDataSetting.stages[scope.beConstituent.rows[0].children[0].segments[x].metrics[0].displayName
																.split(' ')[0]
																.toLowerCase()]) {
															htmlValue += "<th class='detail'> ";
															htmlValue += "<table class='subtable'> ";
															htmlValue += "<tr> ";
															for ( var y in scope.beConstituent.rows[0].children[0].segments[x].metrics) {
																htmlValue += (y == 0) ? "<td class='boldDetail' style='border-bottom: 1pt solid #000;'>{{beDataSetting.segmentation == 'allover' ? beConstituent.rows[0].children[0].segments["
																		+ x
																		+ "].metrics["
																		+ y
																		+ "].shortName : beConstituent.rows[0].children[0].segments["
																		+ x
																		+ "].metrics["
																		+ y
																		+ "].camsShortName}}</td> "
																		: scope.isAdditional ? "<td class='detail' style='border-bottom: 1pt solid #000;'>"
																				+ "{{beDataSetting.segmentation == 'allover' ? beConstituent.rows[0].children[0].segments["
																				+ x
																				+ "].metrics["
																				+ y
																				+ "].shortName : beConstituent.rows[0].children[0].segments["
																				+ x
																				+ "].metrics["
																				+ y
																				+ "].camsShortName}}</td> "
																				: "";
															}
															htmlValue += "</tr> ";
															htmlValue += "</table> ";
															htmlValue += "</th> ";
														}
													}
												} else {
													for ( var x in scope.beConstituent.rows[1].children[0].segments) {
														if (scope.beDataSetting.stages[scope.beConstituent.rows[1].children[0].segments[x].metrics[0].displayName
																.split(' ')[0]
																.toLowerCase()]) {
															htmlValue += "<th class='detail'> ";
															htmlValue += "<table class='subtable'> ";
															htmlValue += "<tr> ";
															for ( var y in scope.beConstituent.rows[1].children[0].segments[x].metrics) {
																htmlValue += (y == 0) ? "<td class='boldDetail' style='border-bottom: 1pt solid #000;'>{{beDataSetting.segmentation == 'allover' ? beConstituent.rows[1].children[0].segments["
																		+ x
																		+ "].metrics["
																		+ y
																		+ "].shortName : beConstituent.rows[1].children[0].segments["
																		+ x
																		+ "].metrics["
																		+ y
																		+ "].camsShortName}}</td> "
																		: scope.isAdditional ? "<td class='detail' style='border-bottom: 1pt solid #000;'>"
																				+ "{{beDataSetting.segmentation == 'allover' ? beConstituent.rows[1].children[0].segments["
																				+ x
																				+ "].metrics["
																				+ y
																				+ "].shortName : beConstituent.rows[1].children[0].segments["
																				+ x
																				+ "].metrics["
																				+ y
																				+ "].camsShortName}}</td> "
																				: "";
															}
															htmlValue += "</tr> ";
															htmlValue += "</table> ";
															htmlValue += "</th> ";
														}
													}
												}
											}

											htmlValue += "</tr> "
											htmlValue += "</table> ";

											elem.html(htmlValue);
											$compile(elem.contents())(scope);
											relocateTitle();
										}
										
										function relocateTitle(){
											scope.$emit('titleFix', scope.beTitleName);
										}
										
										scope.$watch(
												'[beConstituent,isAdditional,beDataSetting]',
												update, true);
									}
								};
							});
		});
