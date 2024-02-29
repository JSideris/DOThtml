import CssDataType from "./css-data-type";

export default class CssColor extends CssDataType{
	r: number;
	g: number;
	b: number;
	a: number;
	constructor(value){
		super("color");
		this.r = 0;
		this.g = 0;
		this.b = 0;
		this.a = 1;

		// This is typically the way dothtml passes in values to colors. Flatten.
		if(Array.isArray(value) && value.length == 1) value = value[0];

		if(typeof value == "number") {
			this.b = value & 0xFF;
			value >>= 8;
			this.g = value & 0xFF;
			value >>= 8;
			this.r = value & 0xFF;
		}
		else if(typeof value == "string") {
			// value = value[0];
			if(value == "" || value == "none" || value == "initial" || value == "inherit"){} //Nothing more needs to be done.
			else if(value[0] == "#"){
				var cH = value.split("#")[1];
				if(cH.length == 3){
					this.r = Number("0x" + cH[0] + "" + cH[0]);
					this.g = Number("0x" + cH[1] + "" + cH[1]);
					this.b = Number("0x" + cH[2] + "" + cH[2]);

				}
				else if(cH.length == 6){
					this.r = Number("0x" + cH[0] + "" + cH[1]);
					this.g = Number("0x" + cH[2] + "" + cH[3]);
					this.b = Number("0x" + cH[4] + "" + cH[5]);
				}
				//else throw value + " is not a valid color"; //or just stick with black.
			}
			else if(value.toLowerCase().indexOf("rgb") === 0){
				//This also handles rgba.
				var cData = value.split("(")[1];
				cData = cData.split(")")[0];
				var cDataItems = cData.split(",");
				if(cDataItems.length == 3 || cDataItems.length == 4){
					this.r = Number(cDataItems[0]);
					this.g = Number(cDataItems[1]);
					this.b = Number(cDataItems[2]);
					this.a = Number(cDataItems[3] || 1);
				}
			}
			else{
				var r = 0;
				var g = 0;
				var b = 0;
				switch(value.toLowerCase()){
					case 'aliceblue':r=0xF0;g=0xF8;b=0xFF;break;
					case 'antiquewhite':r=0xFA;g=0xEB;b=0xD7;break;
					case 'aqua':r=0x00;g=0xFF;b=0xFF;break;
					case 'aquamarine':r=0x7F;g=0xFF;b=0xD4;break;
					case 'azure':r=0xF0;g=0xFF;b=0xFF;break;
					case 'beige':r=0xF5;g=0xF5;b=0xDC;break;
					case 'bisque':r=0xFF;g=0xE4;b=0xC4;break;
					case 'black':r=0x00;g=0x00;b=0x00;break;
					case 'blanchedalmond':r=0xFF;g=0xEB;b=0xCD;break;
					case 'blue':r=0x00;g=0x00;b=0xFF;break;
					case 'blueviolet':r=0x8A;g=0x2B;b=0xE2;break;
					case 'brown':r=0xA5;g=0x2A;b=0x2A;break;
					case 'burlywood':r=0xDE;g=0xB8;b=0x87;break;
					case 'cadetblue':r=0x5F;g=0x9E;b=0xA0;break;
					case 'chartreuse':r=0x7F;g=0xFF;b=0x00;break;
					case 'chocolate':r=0xD2;g=0x69;b=0x1E;break;
					case 'coral':r=0xFF;g=0x7F;b=0x50;break;
					case 'cornflowerblue':r=0x64;g=0x95;b=0xED;break;
					case 'cornsilk':r=0xFF;g=0xF8;b=0xDC;break;
					case 'crimson':r=0xDC;g=0x14;b=0x3C;break;
					case 'cyan':r=0x00;g=0xFF;b=0xFF;break;
					case 'darkblue':r=0x00;g=0x00;b=0x8B;break;
					case 'darkcyan':r=0x00;g=0x8B;b=0x8B;break;
					case 'darkgoldenrod':r=0xB8;g=0x86;b=0x0B;break;
					case 'darkgray':r=0xA9;g=0xA9;b=0xA9;break;
					case 'darkgrey':r=0xA9;g=0xA9;b=0xA9;break;
					case 'darkgreen':r=0x00;g=0x64;b=0x00;break;
					case 'darkkhaki':r=0xBD;g=0xB7;b=0x6B;break;
					case 'darkmagenta':r=0x8B;g=0x00;b=0x8B;break;
					case 'darkolivegreen':r=0x55;g=0x6B;b=0x2F;break;
					case 'darkorange':r=0xFF;g=0x8C;b=0x00;break;
					case 'darkorchid':r=0x99;g=0x32;b=0xCC;break;
					case 'darkred':r=0x8B;g=0x00;b=0x00;break;
					case 'darksalmon':r=0xE9;g=0x96;b=0x7A;break;
					case 'darkseagreen':r=0x8F;g=0xBC;b=0x8F;break;
					case 'darkslateblue':r=0x48;g=0x3D;b=0x8B;break;
					case 'darkslategray':r=0x2F;g=0x4F;b=0x4F;break;
					case 'darkslategrey':r=0x2F;g=0x4F;b=0x4F;break;
					case 'darkturquoise':r=0x00;g=0xCE;b=0xD1;break;
					case 'darkviolet':r=0x94;g=0x00;b=0xD3;break;
					case 'deeppink':r=0xFF;g=0x14;b=0x93;break;
					case 'deepskyblue':r=0x00;g=0xBF;b=0xFF;break;
					case 'dimgray':r=0x69;g=0x69;b=0x69;break;
					case 'dimgrey':r=0x69;g=0x69;b=0x69;break;
					case 'dodgerblue':r=0x1E;g=0x90;b=0xFF;break;
					case 'firebrick':r=0xB2;g=0x22;b=0x22;break;
					case 'floralwhite':r=0xFF;g=0xFA;b=0xF0;break;
					case 'forestgreen':r=0x22;g=0x8B;b=0x22;break;
					case 'fuchsia':r=0xFF;g=0x00;b=0xFF;break;
					case 'gainsboro':r=0xDC;g=0xDC;b=0xDC;break;
					case 'ghostwhite':r=0xF8;g=0xF8;b=0xFF;break;
					case 'gold':r=0xFF;g=0xD7;b=0x00;break;
					case 'goldenrod':r=0xDA;g=0xA5;b=0x20;break;
					case 'gray':r=0x80;g=0x80;b=0x80;break;
					case 'grey':r=0x80;g=0x80;b=0x80;break;
					case 'green':r=0x00;g=0x80;b=0x00;break;
					case 'greenyellow':r=0xAD;g=0xFF;b=0x2F;break;
					case 'honeydew':r=0xF0;g=0xFF;b=0xF0;break;
					case 'hotpink':r=0xFF;g=0x69;b=0xB4;break;
					case 'indianred':r=0xCD;g=0x5C;b=0x5C;break;
					case 'indigo':r=0x4B;g=0x00;b=0x82;break;
					case 'ivory':r=0xFF;g=0xFF;b=0xF0;break;
					case 'khaki':r=0xF0;g=0xE6;b=0x8C;break;
					case 'lavender':r=0xE6;g=0xE6;b=0xFA;break;
					case 'lavenderblush':r=0xFF;g=0xF0;b=0xF5;break;
					case 'lawngreen':r=0x7C;g=0xFC;b=0x00;break;
					case 'lemonchiffon':r=0xFF;g=0xFA;b=0xCD;break;
					case 'lightblue':r=0xAD;g=0xD8;b=0xE6;break;
					case 'lightcoral':r=0xF0;g=0x80;b=0x80;break;
					case 'lightcyan':r=0xE0;g=0xFF;b=0xFF;break;
					case 'lightgoldenrodyellow':r=0xFA;g=0xFA;b=0xD2;break;
					case 'lightgray':r=0xD3;g=0xD3;b=0xD3;break;
					case 'lightgrey':r=0xD3;g=0xD3;b=0xD3;break;
					case 'lightgreen':r=0x90;g=0xEE;b=0x90;break;
					case 'lightpink':r=0xFF;g=0xB6;b=0xC1;break;
					case 'lightsalmon':r=0xFF;g=0xA0;b=0x7A;break;
					case 'lightseagreen':r=0x20;g=0xB2;b=0xAA;break;
					case 'lightskyblue':r=0x87;g=0xCE;b=0xFA;break;
					case 'lightslategray':r=0x77;g=0x88;b=0x99;break;
					case 'lightslategrey':r=0x77;g=0x88;b=0x99;break;
					case 'lightsteelblue':r=0xB0;g=0xC4;b=0xDE;break;
					case 'lightyellow':r=0xFF;g=0xFF;b=0xE0;break;
					case 'lime':r=0x00;g=0xFF;b=0x00;break;
					case 'limegreen':r=0x32;g=0xCD;b=0x32;break;
					case 'linen':r=0xFA;g=0xF0;b=0xE6;break;
					case 'magenta':r=0xFF;g=0x00;b=0xFF;break;
					case 'maroon':r=0x80;g=0x00;b=0x00;break;
					case 'mediumaquamarine':r=0x66;g=0xCD;b=0xAA;break;
					case 'mediumblue':r=0x00;g=0x00;b=0xCD;break;
					case 'mediumorchid':r=0xBA;g=0x55;b=0xD3;break;
					case 'mediumpurple':r=0x93;g=0x70;b=0xDB;break;
					case 'mediumseagreen':r=0x3C;g=0xB3;b=0x71;break;
					case 'mediumslateblue':r=0x7B;g=0x68;b=0xEE;break;
					case 'mediumspringgreen':r=0x00;g=0xFA;b=0x9A;break;
					case 'mediumturquoise':r=0x48;g=0xD1;b=0xCC;break;
					case 'mediumvioletred':r=0xC7;g=0x15;b=0x85;break;
					case 'midnightblue':r=0x19;g=0x19;b=0x70;break;
					case 'mintcream':r=0xF5;g=0xFF;b=0xFA;break;
					case 'mistyrose':r=0xFF;g=0xE4;b=0xE1;break;
					case 'moccasin':r=0xFF;g=0xE4;b=0xB5;break;
					case 'navajowhite':r=0xFF;g=0xDE;b=0xAD;break;
					case 'navy':r=0x00;g=0x00;b=0x80;break;
					case 'oldlace':r=0xFD;g=0xF5;b=0xE6;break;
					case 'olive':r=0x80;g=0x80;b=0x00;break;
					case 'olivedrab':r=0x6B;g=0x8E;b=0x23;break;
					case 'orange':r=0xFF;g=0xA5;b=0x00;break;
					case 'orangered':r=0xFF;g=0x45;b=0x00;break;
					case 'orchid':r=0xDA;g=0x70;b=0xD6;break;
					case 'palegoldenrod':r=0xEE;g=0xE8;b=0xAA;break;
					case 'palegreen':r=0x98;g=0xFB;b=0x98;break;
					case 'paleturquoise':r=0xAF;g=0xEE;b=0xEE;break;
					case 'palevioletred':r=0xDB;g=0x70;b=0x93;break;
					case 'papayawhip':r=0xFF;g=0xEF;b=0xD5;break;
					case 'peachpuff':r=0xFF;g=0xDA;b=0xB9;break;
					case 'peru':r=0xCD;g=0x85;b=0x3F;break;
					case 'pink':r=0xFF;g=0xC0;b=0xCB;break;
					case 'plum':r=0xDD;g=0xA0;b=0xDD;break;
					case 'powderblue':r=0xB0;g=0xE0;b=0xE6;break;
					case 'purple':r=0x80;g=0x00;b=0x80;break;
					case 'rebeccapurple':r=0x66;g=0x33;b=0x99;break;
					case 'red':r=0xFF;g=0x00;b=0x00;break;
					case 'rosybrown':r=0xBC;g=0x8F;b=0x8F;break;
					case 'royalblue':r=0x41;g=0x69;b=0xE1;break;
					case 'saddlebrown':r=0x8B;g=0x45;b=0x13;break;
					case 'salmon':r=0xFA;g=0x80;b=0x72;break;
					case 'sandybrown':r=0xF4;g=0xA4;b=0x60;break;
					case 'seagreen':r=0x2E;g=0x8B;b=0x57;break;
					case 'seashell':r=0xFF;g=0xF5;b=0xEE;break;
					case 'sienna':r=0xA0;g=0x52;b=0x2D;break;
					case 'silver':r=0xC0;g=0xC0;b=0xC0;break;
					case 'skyblue':r=0x87;g=0xCE;b=0xEB;break;
					case 'slateblue':r=0x6A;g=0x5A;b=0xCD;break;
					case 'slategray':r=0x70;g=0x80;b=0x90;break;
					case 'slategrey':r=0x70;g=0x80;b=0x90;break;
					case 'snow':r=0xFF;g=0xFA;b=0xFA;break;
					case 'springgreen':r=0x00;g=0xFF;b=0x7F;break;
					case 'steelblue':r=0x46;g=0x82;b=0xB4;break;
					case 'tan':r=0xD2;g=0xB4;b=0x8C;break;
					case 'teal':r=0x00;g=0x80;b=0x80;break;
					case 'thistle':r=0xD8;g=0xBF;b=0xD8;break;
					case 'tomato':r=0xFF;g=0x63;b=0x47;break;
					case 'turquoise':r=0x40;g=0xE0;b=0xD0;break;
					case 'violet':r=0xEE;g=0x82;b=0xEE;break;
					case 'wheat':r=0xF5;g=0xDE;b=0xB3;break;
					case 'white':r=0xFF;g=0xFF;b=0xFF;break;
					case 'whitesmoke':r=0xF5;g=0xF5;b=0xF5;break;
					case 'yellow':r=0xFF;g=0xFF;b=0x00;break;
					case 'yellowgreen':r=0x9A;g=0xCD;b=0x32;break;
				}
				this.r = r;
				this.g = g;
				this.b = b;
			}
		}
		else if(value.length == 3 || value.length == 4){
			this.r = value[0];
			this.g = value[1];
			this.b = value[2];
			if(value.length == 4){
				this.a = value[3];
			}
		}
	}

	toString(){
		var R = Math.round;
		var X = Math.max;
		var N = Math.min;
		if(this.a == 1)
			return "rgb(" + N(255, X(0, R(this.r))) + ", " + N(255, X(0, R(this.g))) + ", " + N(255, X(0, R(this.b))) + ")";
		else
			return "rgba(" + N(255, X(0, R(this.r))) + ", " + N(255, X(0, R(this.g))) + ", " + N(255, X(0, R(this.b))) + ", " + N(1, X(0, this.a)) + ")";
	}
}