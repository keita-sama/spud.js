function correctType (type: string, given: any) {
    return (typeof given === type);
}

export {
    correctType,
};