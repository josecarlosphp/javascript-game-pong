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
    this.sqrA = new Item('sqrA');
    this.sqrB = new Item('sqrB');
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

        this.sqrA.Create();
        this.sqrA.bounce = true;
        this.sqrA.element.style.background = '#ffffff';
        this.sqrA.element.style.position = 'relative';
        this.sqrA.element.style.fontSize = '1px';
        this.container.element.appendChild(this.sqrA.element);

        this.sqrB.Create();
        this.sqrB.bounce = true;
        this.sqrB.element.style.background = '#000000';
        this.sqrB.element.style.position = 'relative';
        this.sqrB.element.style.fontSize = '1px';
        this.sqrA.element.appendChild(this.sqrB.element);

        document.getElementById(this.divId).appendChild(this.container.element);
    };
    this.Resize = function()
    {
        var domRect = this.container.element.getBoundingClientRect();

        this.x = Math.round(domRect.left);
        this.y = Math.round(domRect.bottom);
        this.w = Math.round(domRect.width);
        this.h = Math.round(domRect.height);

        this.sqrA.Resize(Math.round(this.w / 7), Math.round(this.w / 9));
        this.sqrA.MoveTo((this.w + this.sqrA.height) / 2, (this.h - this.sqrA.height) / 2);

        this.sqrB.Resize(Math.round(this.w / 60), Math.round(this.w / 60));
        this.sqrB.MoveTo((this.w + this.sqrB.height) / 2, (this.h - this.sqrB.height) / 2);
        //this.sqrB.element.style.marginTop = -this.sqrA.height + 'px';
    };
	this.Run = function()
	{
        this.sqrA.Move(Math.round(this.sqrA.width / 20), Math.round(this.sqrA.width / 20));
        this.sqrB.Move(Math.round(this.sqrB.width / 3), Math.round(this.sqrB.width / 3));

        window.onresize = function(evt){
            //No podemos utilizar this. porque este método será llamado onkeydown del documento
            var varName = document.getElementById('container').name;

            eval(varName+'.Resize();');
        };

		this.newGame();
		this.running();
	};
	this.running = function()
	{
        //this.sqrB.CollideWith(this.sqrA);

        this.sqrA.Move();
        this.sqrB.Move();

		setTimeout(this.varName+'.running()', 30); //15
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
    this.CollideWith = function(item)
    {
        var points = this.GetPoints();

        var BL = points.bottomLeft.InsideOf(item);
        var BR = points.bottomRight.InsideOf(item);
        var TR = points.topRight.InsideOf(item);
        var TL = points.topLeft.InsideOf(item);

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

    this.InsideOf = function(item){
        var points = item.GetPoints();

        return this.x >= points.bottomLeft.x && this.x <= points.bottomRight.x && this.y >= points.bottomLeft.y && this.y <= points.topLeft.y;
    };
}