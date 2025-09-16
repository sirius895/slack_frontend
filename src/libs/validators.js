export const signUpValidator = (signUpDto) => {
    console.log(signUpDto.password.length);

    if (!signUpDto.username || !signUpDto.email || !signUpDto.password) return "Please Input All Fields.";
    if (!signUpDto.email.includes("@")) return "Email must include @.";
    if (!signUpDto.email.split("@")[1].length) return "There should be some characters following @.";
    if (signUpDto.password.length < 6) return "Password length must be at least 6 characters";
    if (signUpDto.password !== signUpDto.confirmPassword) return "Please confirm password again.";
}