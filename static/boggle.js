class BoggleGame{
    constructor(boardID, secs = 60){
        this.secs = secs;
        this.showTimer();
        this.score = 0;
        this.board = $("#" + boardID);
        this.words = new Set();
        
        this.timer = setInterval(this.tick.bind(this), 1000);
        
        
        $(".add-word").on("submit", this.handleSubmit.bind(this));
        

    }

    showScore(){
        $('.score').text(this.score)
    }
    
    showWord(word) {
        $(".words").append($("<li>", { text: word }));
      }
    
    

    showMessage(msg, cls){
        $(".msg").text(msg).removeClass().addClass(`msg ${cls}`)
    }
    
    async handleSubmit(evt){
        evt.preventDefault();
        const $word = $(".word");
        let word = $word.val();
    
        if(!word) return
    
        if(this.words.has(word)){
            this.showMessage(`Already found ${word}`,"err" );
            return
        }
    
        const resp = await axios.get("/check-word", {params: {word:word}});
        if(resp.data.result === "not-word"){
            this.showMessage(`${word} is not a valid English word`,"err")
        }else if(resp.data.result === "not-on-board"){
            this.showMessage(`${word} is not a valid word on this board` ,"err")
        }else{
            this.score += word.length;
            this.showWord(word)
            this.showScore();
            this.words.add(word);
            this.showMessage(`Added: ${word}` ,"ok");
        }
        $word.val("").focus();
    }

    showTimer(){
        $('.timer').text(this.secs)
    }

    async tick(){
        this.secs -= 1;
        this.showTimer();
    
        if(this.secs == 0){
            clearInterval(this.timer);
            await this.scoreGame();
            
        }
    }
    
    
    
    
    
    async scoreGame(){
        $(".add-word").hide();
        const resp = await axios.post("/post-score", {score: this.score});
        if(resp.data.brokeRecord){
            this.showMessage(`New record: ${this.score}`, "ok"); 
        }else{
            this.showMessage(`Final score: ${this.score}`, "ok");
        }
    }
    
}










