/*
/  This is only when 'dev' mode is activated. Check https://github.com/xkawu/rich-presence-plus for help
*/

const preset = async () => {
    return {
        details: "Rich Presence +",
        largeImageKey: "https://cdn3.emoji.gg/emojis/9588-silver-star.png",
        buttons: [
            {
                label: "Rich Presence +",
                url: "https://github.com/xkawu/rich-presence-plus",
            },
        ],
    };
};

module.exports = { preset };
