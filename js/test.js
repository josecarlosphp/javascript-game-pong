/**
 * @author     José Carlos PHP
 *             https://josecarlosphp.com
 * @license    GNU General Public License version 3
 *             https://opensource.org/licenses/GPL-3.0
 */
function PongGame(divId, varName)
{
    if(!divId){
        document.write('<div id="pong_game"></div>');
        divId = 'pong_game';
    }

	this.divId = divId;
    this.varName = varName ? varName : 'pongGame';
    this.container = new Item('container');
    this.barT = new Item('barT');
    this.barB = new Item('barB');
    this.paddleL = new Item('paddleL');
    this.paddleR = new Item('paddleR');
    this.pluck = new Item('pluck');
	this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    this.Init = function()
    {
        this.container.width = '100%';
        this.container.height = '100%';

        this.container.Create();
        this.container.element.name = this.varName;
        this.container.element.style.background = '#000000';
        this.container.element.style.margin = '0 auto';
        this.container.element.style.cursor = 'none';

        this.barT.Create();
        this.barT.element.style.background = '#ffffff';
        this.barT.element.style.position = 'relative';
        this.barT.element.style.fontSize = '1px';
        this.container.Append(this.barT);

        this.barB.Create();
        this.barB.element.style.background = '#ffffff';
        this.barB.element.style.position = 'relative';
        this.barB.element.style.fontSize = '1px';
        this.container.Append(this.barB);

        this.paddleL.Create();
        this.paddleL.element.style.background = '#ffffff';
        this.paddleL.element.style.position = 'relative';
        this.paddleL.element.style.fontSize = '1px';
        this.container.Append(this.paddleL);

        this.paddleR.Create();
        this.paddleR.element.style.background = '#ffffff';
        this.paddleR.element.style.position = 'relative';
        this.paddleR.element.style.fontSize = '1px';
        this.container.Append(this.paddleR);

        this.pluck.Create();
        this.pluck.bounce = true;
        this.pluck.element.style.background = '#ffffff';
        this.pluck.element.style.position = 'relative';
        this.pluck.element.style.fontSize = '1px';
        this.container.Append(this.pluck);

        document.getElementById(this.divId).appendChild(this.container.element);
    };
    this.Resize = function()
    {
        var domRect = this.container.element.getBoundingClientRect();

        this.x = Math.round(domRect.left);
        this.y = Math.round(domRect.bottom);
        this.w = Math.round(domRect.width);
        this.h = Math.round(domRect.height);

        this.barT.Resize(this.w, Math.round(this.w / 60));
        this.barT.MoveTo(0, this.h - this.barT.height);

        this.barB.Resize(this.w, Math.round(this.w / 60));
        this.barB.MoveTo(0, 0);
        this.barB.element.style.marginTop = -this.barT.height + 'px';

        this.paddleL.Resize(Math.round(this.w / 60), Math.round(this.h * 5 / 40));
        this.paddleL.MoveTo(this.paddleL.width * 3, (this.h - this.paddleL.height) / 2);
        this.paddleL.element.style.marginTop = -this.barT.height + 'px';

        this.paddleR.Resize(Math.round(this.w / 60), Math.round(this.h * 5 / 40));
        this.paddleR.MoveTo(this.w -(this.paddleR.width * 4), (this.h - this.paddleR.height) / 2);
        this.paddleR.element.style.marginTop = -this.paddleL.height + 'px';

        this.pluck.Resize(Math.round(this.w / 60), Math.round(this.w / 60));
        this.pluck.MoveTo((this.w + this.pluck.height) / 2, (this.h - this.pluck.height) / 2);
        this.pluck.element.style.marginTop = -this.paddleR.height + 'px';

        this.pluck.Move(null, Math.round(this.w / 180));
        this.pluck.Move(Math.round(this.h / (180 * this.h / this.w), null));

        //this.pluck.Move(null, Math.round(this.pluck.width / 3));
        //this.pluck.Move(Math.round(this.pluck.width / 3, null));

        //this.pluck.Move(null, 1);
        //this.pluck.Move(1, null);
    };
	this.Run = function()
	{
        window.onresize = function(evt){
            //No podemos utilizar this. porque este método será llamado onkeydown del documento
            var varName = document.getElementById('container').name;

            eval(varName+'.Resize();');
        };

        document.onkeydown = function(evt){
			if(!evt){
                var evt = window.event;
            }
            var key = window.Event ? evt.which : evt.keyCode;

            //No podemos utilizar this. porque este método será llamado onkeydown del documento
            var varName = document.getElementById('container').name;

            switch(key){
                case 87: //W
                    eval(varName+'.paddleL.Move(null, Math.round('+varName+'.h / 60));');
                    break;
                case 83: //S
                    eval(varName+'.paddleL.Move(null, -Math.round('+varName+'.h / 60));');
                    break;
                case 79: //O
                    eval(varName+'.paddleR.Move(null, Math.round('+varName+'.h / 60));');
                    break;
                case 76: //L
                    eval(varName+'.paddleR.Move(null, -Math.round('+varName+'.h / 60));');
                    break;
                default:
                    //alert(key);
                    break;
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
                    eval(varName+'.paddleL.Stop();');
                    break;
                case 79: //O
                case 76: //L
                    eval(varName+'.paddleR.Stop();');
                    break;
            }
		};

		this.newGame();
		this.running();
	};
	this.running = function()
	{
        this.pluck.IsColliding(this.barT);
        this.pluck.IsColliding(this.barB);
        this.pluck.IsColliding(this.paddleL);
        this.pluck.IsColliding(this.paddleR);

        this.paddleL.IsColliding(this.barT);
        this.paddleL.IsColliding(this.barB);

        this.paddleR.IsColliding(this.barT);
        this.paddleR.IsColliding(this.barB);

        this.pluck.Move();
        this.paddleL.Move();
        this.paddleR.Move();

		setTimeout(this.varName+'.running()', 1); //15
	};
	this.newGame = function(server)
	{
	};
}

function Item(id)
{
    this.id = id;
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.element = null;
	this.incY = 0;
    this.incX = 0;
    this.bounce = false;

    this.Create = function(){
        this.element = document.createElement('div');
        this.element.id = this.id;
        this.Resize(this.width, this.height);
    };
    this.Append = function(item){
        this.element.appendChild(item.element);
    };
    this.Resize = function(width, height){
        this.width = width;
        this.height = height;
        this.element.style.width = this.width === '100%' ? this.width : (this.width + 'px');
        this.element.style.height = this.height === '100%' ? this.height : (this.height + 'px');
    };
    this.Move = function(incX, incY)
	{
        if(incX !== undefined && incX !== null){
            this.incX = incX;
        }
		if(incY !== undefined && incY !== null){
            this.incY = incY;
        }
        this.MoveTo(this.x + this.incX, this.y + this.incY);
	};
    this.MoveTo = function(x, y){
        if(this.bounce){
            if(x > this.GetParentWidth() - this.width){
                x = this.GetParentWidth() - this.width;
                this.incX = -this.incX;
            }else if(x < 0){
                x = 0;
                this.incX = -this.incX;
            }
            if(y > this.GetParentHeight() - this.height){
                y = this.GetParentHeight() - this.height;
                this.incY = -this.incY;
            }else if(y < 0){
                y = 0;
                this.incY = -this.incY;
            }
        }else{
            if(x > this.GetParentWidth() - this.width){
                x = this.GetParentWidth() - this.width;
                this.intX = 0;
            }else if(x < 0){
                x = 0;
                this.intX = 0;
            }
            if(y > this.GetParentHeight() - this.height){
                y = this.GetParentHeight() - this.height;
                this.intY = 0;
            }else if(y < 0){
                y = 0;
                this.intY = 0;
            }
        }
        this.x = x;
        this.y = y;
        this.element.style.left = this.x + 'px';
        this.element.style.bottom = (this.y + this.height - this.GetParentHeight()) + 'px';
    };
	this.Stop = function()
	{
		this.incX = 0;
        this.incY = 0;
	};
    this.GetParentWidth = function()
    {
        return this.element.parentElement.clientWidth; //offsetWidth //scrollWidth
    };
    this.GetParentHeight = function()
    {
        return this.element.parentElement.clientHeight; //offsetHeight //scrollHeight
    };
    this.GetPoints = function()
    {
        return {
            bottomLeft:new Point(this.x, this.y),
            bottomRight:new Point(this.x + this.width, this.y),
            topRight:new Point(this.x + this.width, this.y + this.height),
            topLeft:new Point(this.x, this.y + this.height)
        };
    };
    this.IsColliding = function(item)
    {
        var points = this.GetPoints();

        var BL = points.bottomLeft.IsInside(item);
        var BR = points.bottomRight.IsInside(item);
        var TR = points.topRight.IsInside(item);
        var TL = points.topLeft.IsInside(item);

        if(BL || BR || TR || TL){
            var w = 0;
            var h = 0;

            if(BL && !BR && !TR && !TL){
                w = item.x + item.width - this.x;
                h = item.y + item.height - this.y;
            }else if(!BL && BR && !TR && !TL){
                w = this.x + this.width - item.x;
                h = item.y + item.height - this.y;
            }else if(!BL && !BR && TR && !TL){
                w = this.x + this.width - item.x;
                h = this.y + this.height - item.y;
            }else if(!BL && !BR && !TR && TL){
                w = item.x + item.width - this.x;
                h = this.y + this.height - item.y;
            }else if(BL && BR && !TR && !TL){
                w = item.width;
                h = item.y + item.height - this.y;
            }else if(BL && !BR && !TR && TL){
                w = item.x + item.width - this.x;
                h = this.y;
            }else if(!BL && !BR && TR && TL){
                w = this.x;
                h = this.y + this.height - item.y;
            }else if(!BL && BR && TR && !TL){
                w = this.x + this.width - item.x;
                h = this.y;
            }

            if(this.bounce){
                if(w > h){
                    this.incY = -this.incY;
                }else if(w < h){
                    this.incX = -this.incX;
                }else{
                    this.incX = -this.incX;
                    this.incY = -this.incY;
                }
            }else{
                if(BL && !BR && !TR && !TL){
                    if(w > h){
                        this.y = item.y + item.height;
                    }else if(w < h){
                        this.x = item.x + item.width;
                    }else{
                        this.y = item.y + item.height;
                        this.x = item.x + item.width;
                    }
                }else if(!BL && BR && !TR && !TL){
                    if(w > h){
                        this.y = item.y + item.height;
                    }else if(w < h){
                        this.x = item.x - this.width;
                    }else{
                        this.y = item.y + item.height;
                        this.x = item.x - this.width;
                    }
                }else if(!BL && !BR && TR && !TL){
                    if(w > h){
                        this.y = item.y - this.height;
                    }else if(w < h){
                        this.x = item.x - this.width;
                    }else{
                        this.y = item.y - this.height;
                        this.x = item.x - this.width;
                    }
                }else if(!BL && !BR && !TR && TL){
                    if(w > h){
                        this.y = item.y - this.height;
                    }else if(w < h){
                        this.x = item.x + item.width;
                    }else{
                        this.y = item.y - this.height;
                        this.x = item.x + item.width;
                    }
                }else if(BL && BR && !TR && !TL){
                    this.y = item.y + item.height;
                }else if(BL && !BR && !TR && TL){
                    this.x = item.x + item.width;
                }else if(!BL && !BR && TR && TL){
                    this.y = item.y - this.height;
                }else if(!BL && BR && TR && !TL){
                    this.x = item.x - this.width;
                }

                this.Stop();
            }

            return true;
        }

        return false;
    };
}

function Point(x, y)
{
    this.x = x;
    this.y = y;

    this.IsInside = function(item){
        var points = item.GetPoints();

        return this.x >= points.bottomLeft.x && this.x <= points.bottomRight.x && this.y >= points.bottomLeft.y && this.y <= points.topLeft.y;
    };
}