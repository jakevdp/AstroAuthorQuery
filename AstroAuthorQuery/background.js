// Copyright (c) 2012 Jake Vanderplas
// Licence GPL

// This event is fired each time the user updates the text in the omnibox,
// as long as the extension's keyword mode is still active.
chrome.omnibox.onInputChanged.addListener(
  function(text, suggest) {
    console.log('inputChanged: ' + text);
    suggest([
	{content: "Einstein 1906-1910",
	 description: "Example: \"Einstein 1906-1910\""}
    ]);
  });


// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
  function(text) {
      var words = text.split(" ");

      // Regular expression to match 4-digit years
      var year_re = /^[1-2][0-9][0-9][0-9]$/;

      // Regular expression to match year range (e.g. 1999-2002)
      var year_range_re = /^[1-2][0-9][0-9][0-9]-[1-2][0-9][0-9][0-9]$/
      
      var author = "";
      var start_year = "";
      var end_year = "";
      
      var authors = [];
      var years = [];
      var tmp_list = []

      for (var i = 0; i < words.length; i++) {
	  if (year_re.test(words[i])){
	      years.push(words[i]);
	      // alert("year: " + words[i]);
	  }
	  else if (year_range_re.test(words[i])){
	      years = words[i].split('-');
	      // alert("year range: " + words[i]);
	  }
	  else{
	      if(words[i] == '&' || words[i] == 'and'){
		  authors.push('%0D%0A');
	      }
	      else{
		  tmp_list = words[i].split('&');
		  for (var j = 0; j < tmp_list.length - 1; j++){
		      authors.push(tmp_list[j]);
		      authors.push('%0D%0A');
		  }
		  authors.push(tmp_list[tmp_list.length - 1]);
	      }
	  }
      }

      author = authors.join(" ");

      if (years.length == 1)
      {
	  start_year = years[0];
	  end_year = years[0];
      }
      else if (years.length >= 2)
      {
	  start_year = years[0];
	  end_year = years[1];
      }

      // alert("author: " + author + "\n" +  "start year: " + start_year + "\n" + "end_year: " + end_year);

      open_search_page(author, start_year, end_year);
  });


function open_search_page(author, start_year, end_year) {
    var url = 'http://adsabs.harvard.edu/cgi-bin/nph-abs_connect?db_key=AST&db_key=PRE&qform=AST&arxiv_sel=astro-ph&arxiv_sel=cond-mat&arxiv_sel=cs&arxiv_sel=gr-qc&arxiv_sel=hep-ex&arxiv_sel=hep-lat&arxiv_sel=hep-ph&arxiv_sel=hep-th&arxiv_sel=math&arxiv_sel=math-ph&arxiv_sel=nlin&arxiv_sel=nucl-ex&arxiv_sel=nucl-th&arxiv_sel=physics&arxiv_sel=quant-ph&arxiv_sel=q-bio&sim_query=YES&ned_query=YES&adsobj_query=YES&aut_req=YES&aut_logic=AND&obj_logic=OR&author=' + author + '&object=&start_mon=&start_year=' + start_year + '&end_mon=&end_year=' + end_year + '&ttl_logic=OR&title=&txt_logic=OR&text=&nr_to_return=200&start_nr=1&jou_pick=ALL&ref_stems=&data_and=ALL&group_and=ALL&start_entry_day=&start_entry_mon=&start_entry_year=&end_entry_day=&end_entry_mon=&end_entry_year=&min_score=&sort=SCORE&data_type=SHORT&aut_syn=YES&ttl_syn=YES&txt_syn=YES&aut_wt=1.0&obj_wt=1.0&ttl_wt=0.3&txt_wt=3.0&aut_wgt=YES&obj_wgt=YES&ttl_wgt=YES&txt_wgt=YES&ttl_sco=YES&txt_sco=YES&version=1';

    chrome.tabs.getSelected(null, function(tab) {
	chrome.tabs.update(tab.id, {url: url});
    });
}