function formatHTML(html){
	html = html.toLowerCase();
	var html2 = "";
	for(var i = 0; i < html.length; i++){
		var chr = html.charAt(i);
		var chrC = chr.charCodeAt(0);
		if(chrC >= 32 && chrC <= 126){
			html2 += chr;
		}
	}
	html = html2;
	html = html.split("=\"disabled\"").join("");
	html = html.split(" value=\"\"").join("");
	html = html.split(" type=submit").join("");
	html = html.split("\"").join("");
	html = html.split("\'").join("");
	return html;
}

export default function addTest(description: string, testFunc: Function, expected: string|Array<string>, testTimeout?: number){
	//if(description != "Conditional rendering - if true->false elseif false->true.") return;
	// let exception = null;
	// try{
	// }
	// catch(e){
	// 	exception = e;
	// }
	test(description, done => {
		let testResult;
		testResult = testFunc();
		
		// Exceptions thrown will fail the test.
		// if(exception) throw exception;

		setTimeout(function(){
			let resultHtml = testResult.__document ? testResult.__document.innerHTML : "";

			let processedResult = formatHTML(resultHtml);
			let testExpected = "";
			try{
				if(expected instanceof Array){
					let i = 0;
					for(i = 0; i < expected.length; i++){
						let testExpected = formatHTML(expected[i]);
						if(testExpected == processedResult) break;
					}
					// Not sure how this was supposed to work???
					// if(!i == expected.length) i = 0;
					if(i == expected.length) i = 0;
					expect(processedResult).toBe(formatHTML(expected[i]));
				}
				else{
					testExpected = formatHTML(expected);
					expect(processedResult).toBe(testExpected);
				}
			}
			catch(e){
				done(e);
				return;
			}

			done();

		}, testTimeout ?? 0);
	});
}