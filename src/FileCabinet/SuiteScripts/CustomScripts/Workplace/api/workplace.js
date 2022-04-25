define(['./lib/profile', './lib/message'],

function(profile, message) {
   
	updateProfile = function(option) {
		return profile.update(option);
	};
	
    return {
    	updateProfile : updateProfile
    };
    
});
