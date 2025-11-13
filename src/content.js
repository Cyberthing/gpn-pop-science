
import config from "data/config.yaml"
import cover from "data/cover.yaml"
import a1 from "data/article1.yaml"
import a2 from "data/article2.yaml"
import a3 from "data/article3.yaml"
import a4 from "data/article4.yaml"
import a5 from "data/article5.yaml"
import player from "data/player.yaml"

export default {
    config,
    main:{
        config,
        cover,
        player,
        articles:[a1, a2, a3, a4, a5]
    },
}
