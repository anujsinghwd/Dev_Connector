const isEmpty = require('./is_empty');
const validator = require('validator');

module.exports = function validateProjectInput(data){
    let errors = {};
    
    data.title = !isEmpty(data.title) ? data.title : '';
    data.from = !isEmpty(data.from) ? data.from : '';
    
    if(validator.isEmpty(data.title)){
        errors.title = 'Project title is required';
    }

    if(validator.isEmpty(data.from)){
        errors.from = 'From date field is required';
    }

    if(!isEmpty(data.projectUrl)){
        if(!validator.isURL(data.projectUrl)){
            errors.projectUrl = 'Not a valid URL';
        }
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};