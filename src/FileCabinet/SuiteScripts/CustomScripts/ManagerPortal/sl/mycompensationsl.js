/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime', 'N/query', 'N/file', 'N/search', 'N/ui/serverWidget', '../../Library/handlebars'],
	/**
	 * @param {file} file
	 * @param {serverWidget} serverWidget
	 */
	function (record, runtime, query, file, search, serverWidget, handlebars) {

		/**
		 * Definition of the Suitelet script trigger point.
		 *
		 * @param {Object} context
		 * @param {ServerRequest} context.request - Encapsulation of the incoming request
		 * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
		 * @Since 2015.2
		 */

		var animals = ["Deer", "Goat", "Jaguar", "Panther", "Chicken", "Salamander", "Dog", "Civet", "Lemur", "Ermine", "Bear", "Lizard", "Hamster", "Guanaco", "Hippopotamus", "Capybara", "Ground hog", "Mule", "Octopus", "Bumble bee", "Lamb", "Fox", "Ram", "Sheep", "Hedgehog", "Eland", "Hog", "Kangaroo", "Dromedary", "Rooster", "Aoudad", "Mare", "Waterbuck", "Armadillo", "Dormouse", "Dingo", "Ox", "Koala", "Walrus", "Aardvark", "Bunny", "Peccary", "Parrot", "Porpoise", "Leopard", "Hyena", "Muskrat", "Prairie dog", "Doe", "Lion", "Gazelle", "Beaver", "Snowy owl", "Anteater", "Cat", "Wombat", "Jackal", "Fish", "Mole", "Mountain goat", "Baboon", "Steer", "Rabbit", "Canary", "Iguana", "Bald eagle", "Crocodile", "Colt", "Zebu", "Finch", "Woodchuck", "Gila monster", "Warthog", "Bighorn", "Panda", "Addax", "Porcupine", "Monkey", "Marmoset", "Silver fox", "Okapi", "Elk", "Basilisk", "Quagga", "Tiger", "Toad", "Wolverine", "Vicuna", "Musk deer", "Eagle owl", "Mink", "Skunk", "Oryx", "Wolf", "Burro", "Opossum", "Cheetah", "Chimpanzee", "Cow", "Dung beetle", "Cougar", "Guinea pig", "Mynah bird", "Coyote", "Bison", "Musk-ox", "Grizzly bear", "Wildcat", "Elephant", "Parakeet", "Bat", "Seal", "Pony", "Chamois", "Alpaca", "Crow", "Stallion", "Horse", "Shrew", "Otter", "Pronghorn", "Boar", "Squirrel", "Antelope", "Starfish", "Polar bear", "Mouse", "Gopher", "Newt", "Alligator", "Ocelot", "Weasel", "Budgerigar", "Puppy", "Badger", "Camel", "Highland cow", "Chinchilla", "Orangutan", "Hartebeest", "Mustang", "Zebra", "Lovebird", "Snake", "Mandrill", "Gorilla", "Chameleon", "Springbok", "Puma", "Ewe", "Buffalo", "Ferret", "Thorny devil", "Fawn", "Tapir", "Rhinoceros", "Coati", "Pig", "Impala", "Mongoose", "Kitten", "Giraffe", "Donkey", "Chipmunk", "Marten", "Frog", "Gnu", "Gemsbok", "Duckbill platypus", "Meerkat", "Reindeer", "Ape", "Turtle", "Lynx", "Moose", "Hare", "Llama", "Blue crab", "Whale", "Argali", "Dugong", "Rat", "Ibex", "Yak", "Raccoon", "Jerboa", "Bull", "Sloth", "Cairns Birdwing Butterfly", "Giant Burrowing Cockroach", "Goliath Stick Insect", "Hercules Moth", "Echidna", "Platypus", "Bilby", "Marsupial Mole", "Numbat", "Possum", "Quokka", "Quoll", "Sugar Glider", "Tasmanian Devil", "Wallaby", "Bandicoot", "Magpie", "Mountain Tapir", "Andean Flamingo", "Spectacled Bear", "Viscacha", "Condor", "Crested Duck", "Sun Bear", "Chevroain", "Sunda Pangolin", "Gaur", "Black Shrew", "Siamang", "Colugo", "Pittas", "Atlas Moth", "Nilgiri Tahr", "Bustard", "Dhole", "Peacock", "Pudu", "Taruca", "Coruro", "Carabao", "Philippine Eagle", "Tamaraw", "Tarsier", "Binturong", "Pika", "Pangolin", "Saola", "Vaquita", "Purple Frog", "Hirola", "Koala", "Bonobo", "Beluga", "Jaguar", "Bison", "Narwhal", "Armadillo", "Avahi", "Aye-Aye", "Babirusa", "Banteng", "Goral", "Indri", "Kouprey", "Margay", "Numbat", "Quokka", "Serow", "Urial", "Kagu", "Kakapo", "Gavialidae", "Tartaruga", "Tracaja", "Cui-ui", "Spikedace", "Dodo", "Tasmanian Tiger", "Smooth Handfish"];

		function onRequest(context) {

			var paramReq = context.request.parameters;
			var idMe = runtime.getCurrentUser().id;
			var idHrManager = paramReq.hrmanager ? paramReq.hrmanager : 0;
			var idManager = paramReq.manager ? paramReq.manager : 0;
			var sAction = paramReq.action;
			var sTemplate = file.load('SuiteScripts/CustomScripts/ManagerPortal/template/mycompensation_v1_2.html').getContents();//198540
			var arrSql = file.load(198955).getContents().split('{{}}');

			if (sAction == 'backend') {

				context.response.write(JSON.stringify({}));
			}
			else {

				if (paramReq.employee) {
				
					
					if (idHrManager > 0 && idMe == idHrManager){
						idMe = paramReq.employee;
					}
					else if (idManager > 0 && idMe == idManager){
						idMe = paramReq.employee;
					}
					else{
						idMe = paramReq.employee;
					}
				}
				else{
					
					try{
						record.submitFields({
						    type: record.Type.EMPLOYEE,
						    id: idMe,
						    values: {
						        'custentity_mycompensation_checkin': new Date()
						    }
						});	
					}
					catch(err){
						
					}
				}

				var objForm = serverWidget.createForm({
					title: 'MyCompensation 1.2'
				});

				var fldHtml = objForm.addField({
					id: 'custpage_htmlfield',
					type: serverWidget.FieldType.INLINEHTML,
					label: 'HTML Image'
				});

				var sHandlebar = handlebars.compile(sTemplate);

				handlebars.registerHelper('if_even',
					function (conditional) {

						if ((conditional % 2) == 0) {
							return 'left';
						} else {
							return 'right';
						}
					});

				handlebars.registerHelper('currency', 
					function (value) {
						if (value == null) {
							return '0.00';
						}
						else {
							return value.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
						}
					});
				
				handlebars.registerHelper('replace', function (find, replace, options) {
				    var string = options.fn(this);
				    return string.replace(find, replace);
				});
				
				var objSqlParams = {
							'{{id}}' :  idMe,
							'{{hrmanager}}': idHrManager,
							'{{manager}}': idManager};
				
				var objJSON = query.runSuiteQL({
									query: file.load({
										id: '../sql/mycompensation.sql'
									}).getContents().replace(/{{id}}|{{hrmanager}}|{{manager}}/g, 
													function(s){
														return objSqlParams[s];
													}),
									//params: [idMe]
								}).asMappedResults()[0];

				if (objJSON.bonustargetpayfrequency == 'quarterly' && objJSON.bonustargettype == 'Amount') {
					objJSON.freqbonus = objJSON.variable / 4;
				}
				else if (objJSON.bonustargetpayfrequency == 'quarterly' && objJSON.bonustargettype == 'Percent') {
					objJSON.freqbonus = 0.00;
				}
				else {
					objJSON.freqbonus = 0.00;
				}

				var objImage = search.lookupFields({
					type: search.Type.EMPLOYEE,
					id: idMe,
					columns: ['image']
				}).image;

				if (objImage.length > 0) {
					objJSON.image = objImage[0].text;
				}
				else {
					objJSON.image = '';
				}
				
				objJSON.haskolbe = objJSON.kolbeid == -1 ? false : true;
				
				objJSON.animal = (animals[Math.floor(Math.random() * animals.length)]);
				
				if(objJSON.kolbemo === null){
					objJSON.kolbemo ='';
				}
				
				
				objJSON.kolbegauge = (objJSON.kolbemo).replace(/ +/g, '-');
				
//				sSqlCompensationHistory = sSqlCompensationHistory.replace('{{id}}', idMe);
//				objJSON.compensationhistory = query.runSuiteQL(sSqlCompensationHistory).asMappedResults();
				
				objJSON.compensationhistory = query.runSuiteQL({
													query: file.load({
														id: '../sql/mycompensationhistory.sql'
													}).getContents().replace('{{id}}', idMe),
													//params: [idMe]
												}).asMappedResults();
				
				objJSON.allowance = query.runSuiteQL({
										query: file.load({
											id: '../sql/mycompensationallowance.sql'
										}).getContents(),
										params: [idMe]
									}).asMappedResults();

				objJSON.bonus = query.runSuiteQL({
									query: file.load({
										id: '../sql/mycompensationbonus.sql'
									}).getContents(),
									params: [idMe]
								}).asMappedResults();
				
				objJSON.holiday = query.runSuiteQL({
										query: file.load({
											id: '../sql/workholiday.sql'
										}).getContents()
									}).asMappedResults();
				
				objJSON.benefit = query.runSuiteQL({
										query: file.load({
											id: '../sql/mycompensationbenefit.sql'
										}).getContents(), 
										params: [objJSON.subsidiaryid]
									}).asMappedResults();
				
				objJSON.kolbeprofiles = query.runSuiteQL({
					query: file.load({
						id: 'SuiteScripts/CustomScripts/MyCompensation/sql/kolbeprofiles.sql'
					}).getContents()
				}).asMappedResults();
				
				objJSON.variablepercent = ((objJSON.variable/objJSON.totalcompen) * 100).toFixed(2);
				
				if(idMe == -5 || idMe == 171596){
					objJSON.show = true;
				}
				
				var sHtmlTemplate = sHandlebar(objJSON);

				fldHtml.defaultValue = sHtmlTemplate;

				context.response.writePage(objForm);
			}
		}

		return {
			onRequest: onRequest
		};

	});

