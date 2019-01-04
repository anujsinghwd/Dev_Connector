const isEmpty = require('./is_empty');
const validator = require('validator');

module.exports = function validateEducationInput(data){
    let errors = {};
    
    data.school = !isEmpty(data.school) ? data.school : '';
    data.degree = !isEmpty(data.degree) ? data.degree : '';
    data.from = !isEmpty(data.from) ? data.from : '';
    data.fieldOfStudy = !isEmpty(data.fieldOfStudy) ? data.fieldOfStudy : '';

    if(validator.isEmpty(data.school)){
        errors.school = 'School field is required';
    }

    if(validator.isEmpty(data.degree)){
        errors.degree = 'Degree field is required';
    }

    if(validator.isEmpty(data.from)){
        errors.from = 'From date field is required';
    }

    if(validator.isEmpty(data.fieldOfStudy)){
        errors.fieldOfStudy = 'FieldOfStudy date field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
};