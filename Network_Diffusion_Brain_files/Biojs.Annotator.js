/** 
 * Europe PMC citation viewer (http://www.europepmc.org). It retrieves and displays the principal data (such as authors list, title, journal, source and abstract text) connected to the citation specified in the Europe PMC system (http://europepmc.org).
 * 
 * @class Biojs.Citation
 * @extends Biojs
 *
 * @author <a href="mailto:ftalo@ebi.ac.uk">Francesco Talo'</a>
 * @version 1.0.0
 * @category 3
 * 
 * @requires <a href='http://blog.jquery.com/2012/09/20/jquery-1-8-2-released/'>jQuery Core 1.8.2</a>
 * @dependency <script language="JavaScript" type="text/javascript" src="../biojs/dependencies/jquery/jquery-1.8.2.js"></script>
 * 
 * @requires <a href='../biojs/css/biojs.Citations.css'>EPMC Citations CSS</a>
 * @dependency <link href="../biojs/css/biojs.Citations.css" rel="stylesheet" type="text/css" />
 * 
 * @param {Object} options An object with the options for Biojs.Citation component.
 *    
 * @option {string} [target='YourOwnDivId']
 *    Identifier of the DIV tag where the component should be displayed.
 *    
 * @option {int} width 
 *    Width in pixels.
 *    
 * @option {int} [height=undefined] 
 *    Height in pixels. Optional parameter. 
 *    Where specified the div container will extend its length up to that value, and
 *    if the actual length exceeds that value a "Show more Data/Show fewer Data" link will be displayed at the bottom.    
 *    
 * @option {string} citation_id
 *    Identifier of the citation of which we want to show the data. 
 *    The type of the identifier is defined through the parameter source.

 * @option {string} source
 *     Source of the citation of which we want to show the data. It could be one of the following constants: 
 *     <ul>
 *     	<li> Biojs.Citation.MED_SOURCE:"MED"</li>
 *	    <li> Biojs.Citation.PMC_SOURCE:"PMC"</li>
 *		<li> Biojs.Citation.PAT_SOURCE:"PAT"</li>
 *		<li> Biojs.Citation.ETH_SOURCE:"ETH"</li>
 *		<li> Biojs.Citation.HIR_SOURCE:"HIR"</li>
 *		<li> Biojs.Citation.CTX_SOURCE:"CTX"</li>
 *		<li> Biojs.Citation.CBA_SOURCE:"CBA"</li>
 *		<li> Biojs.Citation.AGR_SOURCE:"AGR"</li>
 *		<li> Biojs.Citation.DOI_SOURCE:"DOI"</li>
 *     </ul>
 *     
 * 
 * @option {string} [loadingStatusImage="{BIOJS_HOME}/css/images/ajax-loader-1.gif"] 
 *    Relative path of the image to be displayed on loading status. If it's empty no loading image will be displayed.
 *    
 * @option {string} [proxyUrl="{BIOJS_HOME}/dependencies/proxy/proxy.php"] 
 *    Relative path of the proxy to be used to make the call to the Europe PMC RESTFUL web service    
 *  
 * @option {bool} [showAbstract=true] 
 * 	  If it's true then the abstract text is displayed at the bottom of the div container
 * 
 * @option {string} [elementOrder="TITLE_FIRST"] 
 * 	  It decides the order of display of the citation data. It could be one of the following:
 * <ul>
 * 		<li>Biojs.Citation.TITLE_FIRST:"TITLE_FIRST".  
 *          In this case the order of the elements will be:
 *       	<ol>
 *       		<li>TITLE</li>
 *          	<li>AUTHORS</li>
 *          	<li>JOURNAL</li>
 *          	<li>SOURCE/IDENTIFIER</li>
 *       	</ol>
 *       </li>
 *       <li>Biojs.Citation.AUTHORS_FIRST:"AUTHORS_FIRST". 
 *       In this case the order of the elements will be:
 *       	<ol>
 *       		<li>AUTHORS</li>
 *          	<li>TITLE</li>
 *          	<li>JOURNAL</li>
 *          	<li>SOURCE/IDENTIFIER</li>
 *       	</ol>
 *       </li>
 * </ul>
 * 
 * @option {string} [displayStyle="FULL_STYLE"] 
 * It decides which citation data to display. It could be one of the following:
 * 
 *  <ul>
 * 		<li>Biojs.Citation.FULL_STYLE:"FULL_STYLE".  
 *          In this case all the citation data will be displayed:
 *       	<ol>
 *       		<li>TITLE</li>
 *          	<li>AUTHORS</li>
 *          	<li>JOURNAL</li>
 *          	<li>SOURCE/IDENTIFIER</li>
 *       	</ol>
 *       </li>
 *       <li>Biojs.Citation.TITLE_ONLY_STYLE:"TITLE_ONLY_STYLE". 
 *       In this case only the citation title will be displayed
 *       </li>
 *  </ul>
 * 	
 * 
 * @example 
 * // Example of viewing the data of a Europe PMC citation
 * //All the data will be retrieved through the Europe PMC RESTFUL web service located at http://www.ebi.ac.uk/europepmc/webservices/rest/search/
 * 
 * var instance = new  Biojs.Citation({
 *			target: 'YourOwnDivId',
 *			source: Biojs.Citation.MED_SOURCE,
 *			citation_id: '23962577',
 *			width: 400,
 *	    	proxyUrl: '../biojs/dependencies/proxy/proxy.jsp',
 *	    	displayStyle: Biojs.Citation.FULL_STYLE,
 *	    	elementOrder: Biojs.Citation.TITLE_FIRST,
 *	    	showAbstract: true
 *	    });	
 *     
 *      instance.onCitationLoaded(function (){
 *   	  alert ('Citation loaded successfully');
 *      });
      
 *      instance.onRequestError(function (err){
 *    	  alert ('Error during citation data retrieving:'+err.error);
 *     });
 *     
 *     //triggers the citation data loading process that will use the Europe PMC RESTFUL Web service
 *     instance.loadCitation();
 *
 * 
 */
Biojs.Annotator = Biojs.extend(
/** @lends Biojs.Annotator# */
{
	constructor: function(options){
		
		if (this.opt.proxyUrl != undefined){
			this._proxyUrl = this.opt.proxyUrl;
		}else{
			this._proxyUrl = '../biojs/dependencies/proxy/proxy.php'
		}
		
	},
	
	 /** 
	    * Default options (and its values) for the Citation component. 
	    * @name Biojs.Citation-opt
	    * @type Object
	    */
	opt: {
	   target: undefined,
	   pmcId: undefined,
	   restRdfUrl: 'http://ves-hx-f2.ebi.ac.uk:8080/rdf/services/textmining/servlet/query?query=PREFIX%20dcterms%3A%20%3Chttp%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%3E%0D%0APREFIX%20oa%3A%20%3Chttp%3A%2F%2Fwww.w3.org%2Fns%2Foa%23%3E%0D%0ASELECT%20%3Ftag%20%3Fprefix%20%3Fexact%20%3Fpostfix%20%3Fsection%20%3Fsource%20WHERE%20%7B%0D%0A%3Fannotation%20oa%3AhasBody%20%3Ftag.%0D%0A%3Fannotation%20oa%3AhasTarget%20%3Ftarget.%0D%0A%3Ftarget%20oa%3AhasSource%20%3Chttp%3A%2F%2Feuropepmc.org%2Farticles%2F{pmcid}%3E%20.%0D%0A%3Ftarget%20oa%3AhasSource%20%3Fsource.%0D%0A%3Ftarget%20oa%3AhasSelector%20%3Fselector.%0D%0A%3Ftarget%20dcterms%3AisPartOf%20%3Fsection.%0D%0A%3Fselector%20oa%3Aprefix%20%3Fprefix.%0D%0A%3Fselector%20oa%3Aexact%20%3Fexact.%0D%0A%3Fselector%20oa%3Apostfix%20%3Fpostfix.%0D%0A%7D&format=JSON&inference=false',
	   annotationTypesStart:[],
	   noAnnotationStart:false,
	   idLegend:'',
	   charactersMatch:-1,
	   allowDuplicates:false
	},
	
	_annotationsData:"",
	_annotationsMarked:[],
	_annotationsHighlighted:[],
	 /**
	 * Array containing the supported event names
	 * @name Biojs.Citation-eventTypes
	 */
	eventTypes : [
  		/**
  		 * @name Biojs.Citation#onRequestError
  		 * @event Event raised when there's a problem during the citation data loading. An example could be that some mandatory parameters are missing, or no citation is identified by the specified parameters in the Europe PMC system.
  		 * @param {function} actionPerformed A function which receives an {@link Biojs.Event} object as argument.
  		 * @eventData {Object} source The component which did triggered the event.
  		 * @eventData {string} error Error message explaining the reason of the failure.
  		 * 
  		 * @example 
  		 * instance.onRequestError(
  		 *    function( e ) {
  		 *       alert ('Error during citation data retrieving:'+e.error);
  		 *    }
  		 * ); 
  		 * 
  		 * */
  		"onRequestError",
  		/**
  		 * @name Biojs.Citation#onCitationLoaded
  		 * @event  Event raised when the citation data loading process is successful
  		 * @param {function} actionPerformed A function which receives an {@link Biojs.Event} object as an argument.
  		 * 
  		 * @example 
  		 * instance.onCitationLoaded(
  		 *    function( e ) {
  		 *      alert ('Citation loaded successfully');
  		 *    }
  		 * ); 
  		 * 
  		 * */
  		"onAnnotationsLoaded"
	],
	

	
	load: function() {
		
		
		if (this.opt.pmcId==undefined || this.opt.pmcId ==0){
			 this.raiseEvent(Biojs.Annotator.EVT_ON_REQUEST_ERROR, {error:"pmcId parameter mandatory"});
		}else if (this.opt.target==undefined || this.opt.target ==''){
			 this.raiseEvent(Biojs.Annotator.EVT_ON_REQUEST_ERROR, {error:"target parameter mandatory"});
		}else{
		
			var urlRequest = this.opt.restRdfUrl.replace(new RegExp("{pmcid}", "g"),this.opt.pmcId);
			
			var self = this;
			 jQuery.ajax({
		            type: "GET",
		            url: self._proxyUrl,
		            dataType: 'json',
		            encoding:"UTF-8",
		            contentType: "text/plain; charset=UTF-8",
		            data: {"url": urlRequest},
		            headers: {
		                Accept: "application/json",
		                "Access-Control-Allow-Origin": "*"
		            },
		            success: function(resp) {
		               if (resp.results.bindings!=undefined && resp.results.bindings.length>0){
			               self._highlightAnnotations(resp, jQuery('#'+self.opt.target));
			               self.raiseEvent(Biojs.Annotator.EVT_ON_ANNOTATIONS_LOADED, {});
		              }else{
		            	   self.raiseEvent(Biojs.Annotator.EVT_ON_REQUEST_ERROR, {error:"Impossible to find an annotation for the pmcId "+self.opt.pmcId});
		              }
		              
		            },
		            error: function(e) {
		            	self.raiseEvent(Biojs.Annotator.EVT_ON_REQUEST_ERROR, {error:"Generic error"});
		            }
		      });
			
			
		}
	},
	
	
	_highlightAnnotations: function (annotation_data, div_container){
		
		var tagValue="";
		var type = "";
		var annotation;
		var originalText;
		var annotationsFound = [];
		
		this._annotationsData = annotation_data;
		originalText = div_container.html();
		
		for (var i=0; i<this._annotationsData.results.bindings.length; i++){ 
			annotation= this._annotationsData.results.bindings[i];
			tagValue = annotation.tag.value;
			type = this._getAnnotationType(tagValue); 
			
			if (type!=null){
				if (this._isAnnotationFound(annotationsFound, type)==false){
					annotationsFound[annotationsFound.length]=type;
				}
				
				if ((this._isAnnotationAllowedStart(type))){ 
					originalText = this._highligthAnnotation(originalText, annotation, type);
					if (this._isAnnotationMarked(type)==false){
						this._annotationsMarked[this._annotationsMarked.length]=type;
					}
				}
			}
		}
		
		div_container.html(originalText);
		
		if (this.opt.idLegend!= undefined && this.opt.idLegend!='' && (annotationsFound.length>0) ){
			this._buildAgenda(annotationsFound);
		}
	},
	
	_highligthAnnotation: function(originalText, annotation, type){
		
	    var highligthedAnnotation= this._isAnnotationHighlighted(annotation, type);
	    
	    if (highligthedAnnotation==false){ 
			var style_class = this._getAnnotationStyle(type);
			
			var prefixAnnnotation= this._elaboratePreFixAnnotation(annotation.prefix.value);
			var postfixAnnotation= this._elaboratePostFixAnnotation(annotation.postfix.value);
			var textAnnotation = annotation.exact.value;
			var start=0;
			var replacement="";
	
			indexFound = originalText.indexOf(textAnnotation, start);
			while(indexFound >0){
				prefixHTML = originalText.substr(0, indexFound);
				prefixPlain = this._elaboratePreFixHtml(this._stripsHTMLTags(prefixHTML));
				postfixHTML = originalText.substr(indexFound + textAnnotation.length);
				postfixPlain = this._elaboratePostFixHtml(this._stripsHTMLTags(postfixHTML));
				
				if (this._endsWith(prefixPlain, prefixAnnnotation) && this._startsWith(postfixPlain, postfixAnnotation)){
					replacement = "<span class=\""+style_class+"\">"+textAnnotation+"</span>";
					originalText = prefixHTML + replacement+postfixHTML;
					start = indexFound + replacement.length;
				}else{
					start = indexFound + textAnnotation.length;
				}
				
				indexFound = originalText.indexOf(textAnnotation, start);
			}
		
	    }
		
		return originalText;
	},
	
	_getAnnotationType: function (tagValue){
		var type_ret=null;
		if (this._startsWith(tagValue, "http://purl.uniprot.org/uniprot/")){
			type_ret = Biojs.Annotator.GENES_PROTEINS;
		}else if (this._startsWith(tagValue, "http://identifiers.org/taxonomy/")){
			type_ret = Biojs.Annotator.ORGANISMS;
		}else if (this._startsWith(tagValue, "http://purl.obolibrary.org/obo/CHEBI_")){
			type_ret = Biojs.Annotator.CHEMICALS;
		}else if (this._startsWith(tagValue, "http://purl.obolibrary.org/obo/GO:")){
			type_ret = Biojs.Annotator.GO_TERMS;
		}else if (this._startsWith(tagValue, "http://linkedlifedata.com/resource/umls-concept/")){
			type_ret = Biojs.Annotator.DISEASE;
		}else if (this._startsWith(tagValue, "http://www.ebi.ac.uk/efo/")){
			type_ret = Biojs.Annotator.EFO;
		}else if (this._startsWith(tagValue, "http://identifiers.org/")){
			type_ret = Biojs.Annotator.ACCESSION_NUMBERS;
		}
		
		return  type_ret;
	},
	
	_getAnnotationStyle: function (type){
		var style_class="";
		if (type==Biojs.Annotator.ACCESSION_NUMBERS){
			style_class="accession_numbers_annotation";
		}else if (type==Biojs.Annotator.GENES_PROTEINS){
			style_class="genes_proteins_annotation";
		}else if (type==Biojs.Annotator.ORGANISMS){
			style_class="organisms_annotation";
		}else if (type==Biojs.Annotator.CHEMICALS){
			style_class="chemicals_annotation";
		}else if (type==Biojs.Annotator.GO_TERMS){
			style_class="go_terms_annotation";
		}else if (type==Biojs.Annotator.DISEASE){
			style_class="disease_annotation";
		}else if (type==Biojs.Annotator.EFO){
			style_class="efo_annotation";
		}
		
		return style_class;
	},
	
	_isAnnotationAllowedStart: function (type){
		
		if (this.opt.noAnnotationStart){
			return false;
		}else{ 
			if (this.opt.annotationTypesStart.length==0){
				return true;
			}else{
				for (var i=0;i<this.opt.annotationTypesStart.length; i++){
					if (this.opt.annotationTypesStart[i]==type){
						return true;
					}
				}
			}
		}
		
		return false;
	},
	
    _isAnnotationHighlighted: function (annotation, type){
		var ret=false;
		var exactText;
		if (this.opt.allowDuplicates){
			ret=false;
		}else{ 
			exactText = annotation.exact.value;
			if (this._annotationsHighlighted.length ==0){
				ret=false;
			}else{
				for (var i=0;i<this._annotationsHighlighted.length; i++){
					if ((this._annotationsHighlighted[i].type==type) && (this._annotationsHighlighted[i].exact==exactText)){
						ret=true;
						break;
					}
				}
			}
			
			if (ret==false){
				this._annotationsHighlighted[this._annotationsHighlighted.length]= {"type": type, "exact": exactText};
			}
		}
		
		return ret;
	},
	
   _isAnnotationMarked: function (type){
		
		if (this._annotationsMarked.length==0){
			return false;
		}else{
			for (var i=0;i<this._annotationsMarked.length; i++){
				if (this._annotationsMarked[i]==type){
					return true;
				}
			}
		}
		
		return false;
	},
	
	_elaboratePreFixAnnotation: function (prefix){
		
		if ((this.opt.charactersMatch > 0) && (prefix.length > this.opt.charactersMatch)){
    		return prefix.substr((prefix.length - this.opt.charactersMatch));
    	}else{
    		return prefix;
    	}
		
	},
	
	_elaboratePostFixAnnotation: function (postfix){
		
		if (this._endsWith(postfix, " ")){
			postfix = postfix.substr(0, postfix.length-1);
		}
		
		if ((this.opt.charactersMatch > 0) && (postfix.length > this.opt.charactersMatch)){
    		return postfix.substr(0, this.opt.charactersMatch);
    	}else{
    		return postfix;
    	}
		
	},
	
    _elaboratePreFixHtml: function (prefix){
		
		if ((this.opt.charactersMatch > 0) && (prefix.length > (this.opt.charactersMatch + 5))){
    		return prefix.substr((prefix.length - (this.opt.charactersMatch + 5)));
    	}else{
    		return prefix;
    	}
		
	},
	
	_elaboratePostFixHtml: function (postfix){
		
		if ((this.opt.charactersMatch > 0) && (postfix.length > (this.opt.charactersMatch + 5))){
    		return postfix.substr(0, (this.opt.charactersMatch + 5));
    	}else{
    		return postfix;
    	}
		
	},
	
	_startsWith: function (str, prefix){
		return str.indexOf(prefix) == 0;
	},
	
	_endsWith: function (str, suffix){
		return str.indexOf(suffix, str.length - suffix.length) !== -1;
	},
	
	_stripsHTMLTags:function(inputHTML){
		return inputHTML.replace(/(<([^>]+)>)/ig,"");
	},
	
	_isAnnotationFound: function (annotationsFound, type){
		
		if (annotationsFound.length==0){
			return false;
		}else{
			for (var i=0;i<annotationsFound.length; i++){
				if (annotationsFound[i]==type){
					return true;
				}
			}
		}
		
		return false;
	},
	
	_buildAgenda: function(annotationsTypeMarked){
		if (annotationsTypeMarked.length>0){
			var self = this;
			
			var legendaContainer = jQuery('#'+self.opt.idLegend);
			
			legendaContainer.attr('id','legenda_annotation');
			
			legendaContainer.append('<div id="legenda_annotation_header">ON/OFF OPEN ANNOTATIONS</div>');
			
			
			var legendaElementHTML;
			
			var type;
			
			var styleclass;
			var checkboxId;
			for (var i=0; i<annotationsTypeMarked.length; i++){ 
				type=annotationsTypeMarked[i];
				checkboxId='checkbox_annotation_'+type;
				
				styleclass = self._getAnnotationStyle(type);
				
				legendaElementHTML='<div class="legenda_element">';
				
				if (this._isAnnotationAllowedStart(type)){ 
					legendaElementHTML+='<div class="legenda_element_label"> <input name="'+type+'" type="checkbox" id="'+checkboxId+'" checked="checked"/>';
				}else{
					legendaElementHTML+='<div class="legenda_element_label"> <input name="'+type+'" type="checkbox" id="'+checkboxId+'"/>';
				}
				
				legendaElementHTML+= ' '+self._getLegendLabel(type)+' </div>';
				
				legendaElementHTML+= '<div class="legenda_element_color '+styleclass+'"></div>';
				
				legendaElementHTML+="</div>";
				
				legendaContainer.append(legendaElementHTML);
				
				jQuery('#'+checkboxId).on('click', function(){
					if (jQuery(this).attr('checked')=='checked'){
						self.selectAnnoation(jQuery(this).attr('name'));
					}else{
						self.unselectAnnoation(jQuery(this).attr('name'));
					}
					
				});
				
				
			}
		}
	},
	
	_getLegendLabel: function (type){
		var legend_label="";
		if (type==Biojs.Annotator.ACCESSION_NUMBERS){
			legend_label="ACCESSION NUMBERS";
		}else if (type==Biojs.Annotator.GENES_PROTEINS){
			legend_label="GENES/PROTEINS";
		}else if (type==Biojs.Annotator.ORGANISMS){
			legend_label="ORGANISMS";
		}else if (type==Biojs.Annotator.CHEMICALS){
			legend_label="CHEMICALS";
		}else if (type==Biojs.Annotator.GO_TERMS){
			legend_label="GO TERMS";
		}else if (type==Biojs.Annotator.DISEASE){
			legend_label="DISEASES";
		}else if (type==Biojs.Annotator.EFO){
			legend_label="EFO";
		}
		
		return legend_label;
	},
	
	unselectAnnoation: function (type){
		var originalText = jQuery('#'+this.opt.target).html();
		
		var styleclass = this._getAnnotationStyle(type);
		
		originalText = originalText.replace(new RegExp("<span class=\""+styleclass+"\">", "ig"),"<span class=\""+styleclass+"_disabled\">");
	
		jQuery('#'+this.opt.target).html(originalText);
	},
	
	selectAnnoation: function (type){
		var originalText = jQuery('#'+this.opt.target).html();
		if (this._isAnnotationMarked(type)){
			var styleclass = this._getAnnotationStyle(type);
			originalText = originalText.replace(new RegExp("<span class=\""+styleclass+"_disabled\">", "ig"),"<span class=\""+styleclass+"\">");
		}else{
			var typeAnnotation;
			var tagValue;
			var annotation;
			
			for (var i=0; i<this._annotationsData.results.bindings.length; i++){ 
				annotation= this._annotationsData.results.bindings[i];
				tagValue = annotation.tag.value;
				typeAnnotation = this._getAnnotationType(tagValue); 
				
				if (type==typeAnnotation){ 
					originalText = this._highligthAnnotation(originalText, annotation, type);
				}
			}
			
			this._annotationsMarked[this._annotationsMarked.length]=type;
		}
		
		jQuery('#'+this.opt.target).html(originalText);
	}
	
},{
	 //List of possible annotation types
	GENES_PROTEINS:"GENES_PROTEINS",
	ACCESSION_NUMBERS:"ACCESSION_NUMBERS",
	ORGANISMS:"ORGANISMS",
	CHEMICALS:"CHEMICALS",
	GO_TERMS:"GO_TERMS",
	DISEASE:"DISEASE",
	EFO:"EFO",	
	//Events 
	EVT_ON_ANNOTATIONS_LOADED: "onAnnotationsLoaded",
	EVT_ON_REQUEST_ERROR: "onRequestError"
});