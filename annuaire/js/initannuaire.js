function initannuaire()
{
	var name = $("#name").val();
	$.ajax({
        url: "http://udamobile.u-clermont1.fr/v2/annuaire/searchpage.php",
        type: "POST",
        data: ({name: name}),
		cache:true,
        success: function(feedback){
        	makelist(feedback);	
		}
    });
}		              

function makelist(json){
	//alert(json);
	var html= "";
	if(json!="")
	{
		var makelist = jQuery.isPlainObject(json) ? json: jQuery.parseJSON(json);
		var n=makelist.count;
		if(n==0)
		{
			html+="<li class='ElementListe'><p>Pas resultat pour la recherche demandé</p></li>";
		}
		else
		{
			var listelement = makelist.exact;			
			for(i=0;i<n;i++)
			{
				html+= "<li class=\"annuaire\" data-corners=\"false\" data-wrapperels=\"div\" >"
						+ "<div class=\"ui-btn-inner ui-li\" >"
						+ "<div class=\"ui-btn-text\">" 
						+ "<h3>"
						+ listelement[i].nom 
						+ " "
						+ listelement[i].prenom
						+ "</h3>" 
						+ "<p>Courriel: " 
						+ "<a class=\"udamob_contact_a\" href='mailto:" + listelement[i].mail + "'>" + listelement[i].mail + "</a>"
						+"</p>";
				if(listelement[i].tel) {
					html+= "<p>TEL: " 
							+ "<a class=\"udamob_contact_a\" href='tel:" + listelement[i].tel	+"'>" + listelement[i].tel + "</a>" 
							+ "</p>";
				}
				html+="</div></div></li>";
			}
		}
		$("#listAnnu").html(html);
	}
	
	
	
}