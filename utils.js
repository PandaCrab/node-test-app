const toUpperFirstLetter = (string) => {
    const capitizedString = string.split(' ');

    for (let i = 0; i < capitizedString.length; i++) {
        capitizedString[i] = capitizedString[i].charAt(0).toUpperCase() + capitizedString[i].slice(1); 
    }

    return capitizedString.join(' ');
};

const starRating = (product, rated) => {
    if (Object.keys(product).includes('stars')) {
        const { stars } = product;

        const updatedRating = {
            five: rated === 5 ? stars.five + 1 : stars.five,
            four: rated === 4 ? stars.four + 1 : stars.four,
            three: rated === 3 ? stars.three + 1 : stars.three,
            two: rated === 2 ? stars.two + 1 : stars.two,
            one: rated === 1 ? stars.one + 1 : stars.one
        };

        return updatedRating;
    }

    if (!Object.keys(product).includes('stars')) {
        const newRating = { 
            five: rated === 5 ? 1 : 0,
            four: rated === 4 ? 1 : 0,
            three: rated === 3 ? 1 : 0,
            two: rated === 2 ? 1 : 0,
            one: rated === 1 ? 1 : 0
        };

        return newRating;
    }
}

module.exports = { toUpperFirstLetter, starRating };