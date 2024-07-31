function Validation(values) {
    let errors = {};
    const password_pattern = /^[\s\S]{3,}$/;

    console.log('Validation values:', values);

    if (values.username.trim() === "") {
        errors.username = "Заполните поле";
    } else if (!password_pattern.test(values.password)) {
        errors.password = "Имя должно содержать минимум 2 символа";
    }
  
    if (values.password.trim() === "") {
        errors.password = "Заполните поле";
    } else if (!password_pattern.test(values.password)) {
        errors.password = "Пароль должен содержать минимум 3 символа";
    }
    
    return errors;
}

export default Validation;