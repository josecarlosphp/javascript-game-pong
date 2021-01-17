/**
 * @author     José Carlos PHP
 *             https://josecarlosphp.com
 * @license    GNU General Public License version 3
 *             https://opensource.org/licenses/GPL-3.0
 */
function PongGame(varName, divId)
{
	this.varName = varName ? varName : 'pongGame';
    this.divId = divId ? divId : 'pong_game';
	this.pluck = new Pluck(this);
	this.paddleL = new Paddle('L');
	this.paddleR = new Paddle('R');
	this.scoreL = new Score();
	this.scoreR = new Score();
	this.gamegoals = 15;
	this.server = '';
	this.paused = false;
	this.temp = '';
	this.elements = {container:null, paddleL:null, paddleR:null, pluck:null};
	this.showingMessage = false;
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;

    this.Create = function(id, html){
        var e = document.createElement('div');
        e.id = id;
        if(html){
            e.innerHTML = html;
        }

        return e;
    };
    this.Init = function()
    {
        this.elements.container = this.Create('container');
        this.elements.paddleL = this.Create('paddleL');
        this.elements.paddleR = this.Create('paddleR');
        this.elements.pluck = this.Create('pluck');

        this.elements.container.appendChild(this.elements.paddleL);
        this.elements.container.appendChild(this.elements.paddleR);
        this.elements.container.appendChild(this.elements.pluck);

        document.getElementById(this.divId).appendChild(this.Create('pong_header'));
        document.getElementById('pong_header').appendChild(this.Create('pong_menu', '<table cellpadding="0" cellspacing="0" width="100%"><tr><td><a href="javascript:'+this.varName+'.HowToPlay()">&raquo; How to play</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:'+this.varName+'.Settings()">&raquo; Settings</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:'+this.varName+'.Credits()">&raquo; Credits</a></td><td><div class="pong_score">Score: <span id="pong_scoreL" class="pong_score">0</span> - <span id="pong_scoreR" class="pong_score">0</span> <span class="pong_mini">(reach </span><span id="scoregoalsgame">15</span><span class="pong_mini"> goals to win a game)</span></div></td></tr></table>'));
        document.getElementById(this.divId).appendChild(this.elements.container);

        this.elements.container.appendChild(this.Create('pong_footer'));

        this.elements.container.name = this.varName;
    };
    this.Resize = function()
    {
        var domRect = document.getElementById('container').getBoundingClientRect();

        this.x = Math.round(domRect.left);
        this.y = Math.round(domRect.bottom);
        this.w = Math.round(domRect.width);
        this.h = Math.round(domRect.height);

        this.elements.paddleL.style.width = Math.round(this.w / 60) + 'px';
        this.elements.paddleR.style.width = Math.round(this.w / 60) + 'px';

        this.elements.paddleL.style.height = Math.round(this.h * 5 / 40) + 'px';
        this.elements.paddleR.style.height = Math.round(this.h * 5 / 40) + 'px';

        this.elements.paddleL.style.left = Math.round(this.w * 4 / 60) + 'px';
        this.elements.paddleR.style.left = Math.round(this.w * 55 / 60) + 'px';

        this.elements.pluck.style.width = Math.round(this.w / 60) + 'px';
        this.elements.pluck.style.height = Math.round(this.w / 60) + 'px';

        this.paddleL.maxY = h - this.elements.paddleL.offsetHeight;
        this.paddleR.maxY = h - this.elements.paddleR.offsetHeight;
    };
	this.Run = function()
	{
        this.paddleL.Y = this.h / 2;
        this.paddleR.Y = this.h / 2;

		document.onkeydown = function(evt){
			if(!evt){
                var evt = window.event;
            }
            var key = window.Event ? evt.which : evt.keyCode;

            //No podemos utilizar this. porque este método será llamado onkeydown del documento
            var varName = document.getElementById('container').name;

            switch(key){
                case 87: //W
                    eval(varName+'.paddleL.MoveUp();');
                    break;
                case 83: //S
                    eval(varName+'.paddleL.MoveDown();');
                    break;
                case 79: //O
                    eval(varName+'.paddleR.MoveUp();');
                    break;
                case 76: //L
                    eval(varName+'.paddleR.MoveDown();');
                    break;
                case 80: //P
                    eval(varName+'.SwitchPause();');
                    break;
                case 81: //Q
                    eval(varName+'.Serves(\'L\');');
                    break;
                case 73: //I
                    eval(varName+'.Serves(\'R\');');
                    break;
                default:
                    //alert(key);
            }
		};

		document.onkeyup = function(evt){
            if(!evt){
                var evt = window.event;
            }
            var key = window.Event ? evt.which : evt.keyCode;

            //No podemos utilizar this. porque este método será llamado onkeydown del documento
            var varName = document.getElementById('container').name;

            switch(key){
                case 87: //W
                case 83: //S
                    eval(varName+'.paddleL.Stop()');
                    break;
                case 79: //O
                case 76: //L
                    eval(varName+'.paddleR.Stop()');
                    break;
            }
		};

		this.newGame();
		this.running();
	};
	this.running = function()
	{
		if(!this.paused){
			var r = this.pluck.Move();
			switch(r){
				case 'L':
				case 'R':
					this.goal(r);
					break;
			}
			this.paddleL.Move();
			this.paddleR.Move();
		}
		setTimeout(this.varName+'.running()', 10);
	};
	this.SwitchPause = function(pause)
	{
		if(this.paused = pause == null ? !this.paused : pause){
			this.statusMessage('Game paused (press P to continue)');
		}else{
			this.statusMessage();
		}
	};
	this.goal = function(goaler)
	{
		switch(goaler){
			case 'L':
				var pNum = '1';
				var pStr = 'left';
				break;
			case 'R':
				var pNum = '2';
				var pStr = 'right';
				break;
		}
		this.statusMessage('Player '+pNum+' scores!!');
		eval('this.score'+goaler+'.goals++');
		if(eval('this.score'+goaler+'.goals') >= this.gamegoals){
			this.statusMessage('Player '+pNum+' ('+pStr+') wins the game '+this.scoreL.goals+' to '+this.scoreR.goals);
			eval('this.score'+goaler+'.games++');
			this.newGame(goaler);
		}else{
			this.newPoint(goaler == 'L' ? 'R' : 'L');
		}
		this.RefreshScore();
	};
	this.newPoint = function(server)
	{
		if(server == null){
			server = Math.round(Math.random()) ? 'L' : 'R';
		}
		switch(server){
			case 'L':
				this.statusMessage('Player 1 serves (press Q)', true);
				this.pluck.X = 60;
				break;
			case 'R':
				this.statusMessage('Player 2 serves (press I)', true);
				this.pluck.X = 530;
				break;
		}
		this.pluck.Y = 195;
		this.pluck.Stop();
		this.pluck.Position();
		this.server = server;
	};
	this.newGame = function(server)
	{
		this.scoreL.goals = 0;
		this.scoreR.goals = 0;
		this.newPoint(server);
	};
	this.Serves = function(server)
	{
		if(!this.paused && server == this.server){
			this.server = '';
			this.pluck.incX = server == 'L' ? -5 : 5;
			this.statusMessage();
		}
	};
	this.HowToPlay = function()
	{
		var msg = '<table>';
		msg += '<tr><td class="pong_th" colspan="2">Player 1 (left)</td><td class="pong_th" colspan="2">Player 2 (right)</td><td class="pong_th" colspan="2">General</td></tr>';
		msg += '<tr><td><b>W</b></td><td>Up</td><td><b>O</b></td><td>Up</td><td><b>P</b></td><td>Pause</td></tr>';
		msg += '<tr><td><b>S</b></td><td>Down</td><td><b>L</b></td><td>Down</td><td></td><td></td></tr>';
		msg += '<tr><td><b>Q</b></td><td>Serve</td><td><b>I</b></td><td>Serve</td><td></td><td></td></tr>';
		msg += '</table>';
		msg += '<p>When it\'s your turn to serve, put your paddle just behind the pluck, because it starts moving backward to you.</p>';
		msg += '<p>Depending where the pluck touch your paddle, it will affect its moving one way or another.</p>';
		msg += '<p>Enjoy!!</p>';
		this.ShowMessage(msg,'How to play');
	};
	this.Settings = function()
	{
		var msg = '<table>';
		msg += '<tr><td>Pluck velocity</td><td><select id="pluckvelocity" name="pluckvelocity" onchange="'+this.varName+'.pluck.advance=parseInt(this.value)"><option value="3">slower</option><option value="4">slow</option><option value="5">normal</option><option value="6">fast</option><option value="7">faster</option></select></td></tr>';
		msg += '<tr><td>Goals to win a game</td><td><select id="gamegoals" name="gamegoals" onchange="'+this.varName+'.gamegoals=parseInt(this.value);document.getElementById(\'scoregoalsgame\').innerHTML=this.value"><option value="3">3</option><option value="5">5</option><option value="7">7</option><option value="11">11</option><option value="15">15</option><option value="21">21</option></select></td></tr>';
		msg += '</table>';
		this.ShowMessage(msg,'Settings');
		document.getElementById('pluckvelocity').value = this.pluck.advance;
		document.getElementById('gamegoals').value = this.gamegoals;
	};
	this.Credits = function()
	{
		var msg = '<table>';
		msg += '<tr><td class="pong_th">Javascript programming and xhtml design</td></tr>';
		msg += '<tr><td><b>José Carlos Cruz Parra</b></td></tr>';
		msg += '<tr><td>Web developer / PHP programmer freelance</td></tr>';
		msg += '<tr><td><a href="http://programadorphpfreelance.com" title="Web developer / PHP programmer freelance Homepage">http://programadorphpfreelance.com</a></td></tr>';
		msg += '</table>';
		this.ShowMessage(msg,'Credits');
	};
	this.ShowMessage = function(msg,title)
	{
		this.paused = true;
		if(!this.showingMessage){
			this.temp = this.elements.container.innerHTML;
			this.showingMessage = true;
		}
		this.elements.container.innerHTML = '<div id="pong_msg"><h2>PONG</h2><h3>'+title+'</h3><div id="pong_msgtxt">'+msg+'</div><div><a href="javascript:'+this.varName+'.HideMessage()">&raquo; Back to game</a></div></div>';
	};
	this.HideMessage = function()
	{
		this.elements.container.innerHTML = this.temp;
		this.temp = '';
		this.showingMessage = false;
		this.paused = false;
	};
	this.statusMessage = function(msg, add)
	{
		if(add){
			document.getElementById('pong_footer').innerHTML += ('&nbsp;&nbsp;&nbsp;' + (msg == null ? '&nbsp;' : msg));
		}
		else{
			document.getElementById('pong_footer').innerHTML = msg == null ? '&nbsp;' : msg;
		}
	};
	this.RefreshScore = function()
	{
		document.getElementById('pong_scoreL').innerHTML = this.scoreL.goals;
		document.getElementById('pong_scoreR').innerHTML = this.scoreR.goals;
	};
}

function Pluck(pong)
{
	this.pong = pong;
	this.X = 295;
	this.Y = 195;
	this.incX = 0;
	this.incY = 0;
	this.advance = 5;

	this.Move = function()
	{
		if(this.Y < 1 || this.Y > 390){
			this.incY = -this.incY;
		}
		if(this.X < 1){
			this.incX = this.advance;
			return 'R';
		}
		if(this.X > 590){
			this.incX = -this.advance;
			return 'L';
		}
		if(this.X > 35 && this.X < 50 && this.Y > this.pong.paddleL.Y-10 && this.Y < this.pong.paddleL.Y+65){
			var varIncY = this.calculateVarIncY(this.Y - (this.pong.paddleL.Y-10));
			this.incX = this.incY == 0 && varIncY == 0 ? 2*this.advance : this.advance;
			this.incY += varIncY;
		}
		if(this.X > 540 && this.X < 555 && this.Y > this.pong.paddleR.Y+40 && this.Y < this.pong.paddleR.Y+115){
			var varIncY = this.calculateVarIncY(this.Y - (this.pong.paddleR.Y+40));
			this.incX = this.incY == 0 && varIncY == 0 ? -2*this.advance : -this.advance;
			this.incY += varIncY;
		}
		this.X += this.incX;
		this.Y += this.incY;
		this.Position();
		return '';
	};
	this.calculateVarIncY = function(diff)
	{
		if(diff < 11) return -3;
		if(diff < 21) return -2;
		if(diff < 31) return -1;
		if(diff < 46) return 0;
		if(diff < 56) return 1;
		if(diff < 66) return 2;
		return 3;
	};
	this.Stop = function()
	{
		this.incX = 0;
		this.incY = 0;
	};
	this.Position = function(x, y)
	{
		if(x != null){
            this.X = x;
        }
		if(y != null){
            this.Y = y;
        }
		document.getElementById('pluck').style.left = this.X + 'px';
		document.getElementById('pluck').style.top = this.Y + 'px';
	};
}

function Paddle(LorR)
{
    this.LorR = LorR;
    this.Y = 0;
    this.minY = 0;
	this.incY = 0;
    this.maxY = 0;
	this.maxY = 0;

	this.MoveUp = function()
	{
		this.incY = 5;
		this.Move();
	};
	this.MoveDown = function()
	{
		this.incY = -5;
		this.Move();
	};
	this.Move = function()
	{
		if((this.incY < 0 && this.Y < this.minY) || (this.incY > 0 && this.Y > this.maxY)){
			this.Stop();
		}else{
			this.Y += this.incY;
			document.getElementById('paddle'+this.LorR).style.bottom = this.Y + 'px';
		}
	};
	this.Stop = function()
	{
		this.incY = 0;
	};
}

function Score()
{
	this.goals = 0;
	this.games = 0;
}
