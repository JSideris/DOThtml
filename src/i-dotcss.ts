// Building blocks.
export declare type BasicCommonValues = "inherit"|"initial"|"unset";
export declare type AbsoluteUnits = "cm"|"mm"|"in"|"px"|"pt"|"pc";
export declare type RelativeUnits = "em"|"ex"|"ch"|"rem"|"vw"|"vh"|"vmin"|"vmax"|"%";
export declare type AllUnits = AbsoluteUnits|RelativeUnits;
export declare type OptionalWhitespace = ""|" ";
export declare type UrlType = `url('${string}')`;
export declare type LengthOrDefault = number|`${number}${AllUnits}`;

// ts starts complaining about the complexity of the type :(
//export declare type DigitStr = "0"|"1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9";
// export declare type HexStr = DigitStr|"A"|"B"|"C"|"D"|"E"|"F"|"a"|"b"|"c"|"d"|"e"|"f";

// Types
export declare type BackgroundAttachmentValues = BasicCommonValues|"scroll"|"fixed"|"local"
export declare type BackgroundRepeatValues = BasicCommonValues|"no-repeat"|"repeat"|"space"|"round";
export declare type BackgroundOriginValues = BasicCommonValues|"padding-box"|"border-box"|"content-box";
export declare type BackgroundSizeValues = BasicCommonValues|"auto"|LengthOrDefault|"cover"|"contain";
export declare type BackfaceVisibilityValues = BasicCommonValues|"visible"|"hidden";
export declare type BorderStyles = BasicCommonValues|"dotted"|"dashed"|"solid"|"double"|"groove"|"ridge"|"inset"|"outset"|"none"|"hidden";
export declare type ColorName = BasicCommonValues|"aliceblue"|"antiquewhite"|"aqua"|"aquamarine"|"azure"|"beige"|"bisque"|"black"|"blanchedalmond"|"blue"|"blueviolet"|"brown"|"burlywood"|"cadetblue"|"chartreuse"|"chocolate"|"coral"|"cornflowerblue"|"cornsilk"|"crimson"|"cyan"|"darkblue"|"darkcyan"|"darkgoldenrod"|"darkgray"|"darkgrey"|"darkgreen"|"darkkhaki"|"darkmagenta"|"darkolivegreen"|"darkorange"|"darkorchid"|"darkred"|"darksalmon"|"darkseagreen"|"darkslateblue"|"darkslategray"|"darkslategrey"|"darkturquoise"|"darkviolet"|"deeppink"|"deepskyblue"|"dimgray"|"dimgrey"|"dodgerblue"|"firebrick"|"floralwhite"|"forestgreen"|"fuchsia"|"gainsboro"|"ghostwhite"|"gold"|"goldenrod"|"gray"|"grey"|"green"|"greenyellow"|"honeydew"|"hotpink"|"indianred"|"indigo"|"ivory"|"khaki"|"lavender"|"lavenderblush"|"lawngreen"|"lemonchiffon"|"lightblue"|"lightcoral"|"lightcyan"|"lightgoldenrodyellow"|"lightgray"|"lightgrey"|"lightgreen"|"lightpink"|"lightsalmon"|"lightseagreen"|"lightskyblue"|"lightslategray"|"lightslategrey"|"lightsteelblue"|"lightyellow"|"lime"|"limegreen"|"linen"|"magenta"|"maroon"|"mediumaquamarine"|"mediumblue"|"mediumorchid"|"mediumpurple"|"mediumseagreen"|"mediumslateblue"|"mediumspringgreen"|"mediumturquoise"|"mediumvioletred"|"midnightblue"|"mintcream"|"mistyrose"|"moccasin"|"navajowhite"|"navy"|"oldlace"|"olive"|"olivedrab"|"orange"|"orangered"|"orchid"|"palegoldenrod"|"palegreen"|"paleturquoise"|"palevioletred"|"papayawhip"|"peachpuff"|"peru"|"pink"|"plum"|"powderblue"|"purple"|"rebeccapurple"|"red"|"rosybrown"|"royalblue"|"saddlebrown"|"salmon"|"sandybrown"|"seagreen"|"seashell"|"sienna"|"silver"|"skyblue"|"slateblue"|"slategray"|"slategrey"|"snow"|"springgreen"|"steelblue"|"tan"|"teal"|"thistle"|"tomato"|"turquoise"|"violet"|"wheat"|"white"|"whitesmoke"|"yellow"|"yellowgreen";
export declare type DisplayValues = BasicCommonValues|"inline"|"block"|"contents"|"flex"|"grid"|"inline-block"|"inline-flex"|"inline-grid"|"inline-table"|"list-item"|"run-in"|"table"|"table-caption"|"table-column-group"|"table-header-group"|"table-footer-group"|"table-row-group"|"table-cell"|"table-column"|"table-row"|"none";
export declare type DirectionValues = BasicCommonValues|"ltr"|"rtl";
export declare type FontStyleValues = BasicCommonValues|"normal"|"italic"|"oblique";
export declare type FontVariantValues = BasicCommonValues|"normal"|"small-caps";
export declare type FontVariantCapsValues = FontVariantValues|"all-small-caps"|"petite-caps"|"all-petite-caps"|"unicase"|"titling-caps";
export declare type FontWeightValues = BasicCommonValues|number|"normal"|"bold"|"bolder"|"lighter";
export declare type LengthProp = BasicCommonValues|"maxHeight"|"minHeight"|"top"|"bottom"|"height"|"maxHidth"|"minWidth"|"right"|"left"|"width"|"margin"|"marginTop"|"marginBottom"|"marginLeft"|"marginRight"|"outlineOffset"|"padding"|"paddingTop"|"paddingBottom"|"paddingLeft"|"paddingRight"|"lineHeight"|"flexBasis"|"fontSize";
export declare type OutlineWidthValues = BasicCommonValues|"medium"|"thin"|"thick"|LengthOrDefault;
export declare type PositionNames = BasicCommonValues|"static"|"relative"|"fixed"|"absolute"|"sticky";

export declare type FlexDirectionNames = BasicCommonValues|"row"|"row-reverse"|"column"|"column-reverse";
export declare type FlexWrapNames = BasicCommonValues|"nowrap"|"wrap"|"wrap-reverse";


// Advanced formatted types.
export declare type ColorFormat = BasicCommonValues|ColorName|number|`#${string}`|`rgb(${number},${OptionalWhitespace}${number},${OptionalWhitespace}${number})`|`rgba(${number},${OptionalWhitespace}${number},${OptionalWhitespace}${number},${OptionalWhitespace}${number})`|`hsl(${number},${OptionalWhitespace}${number}%,${OptionalWhitespace}${number}%)`|`hsla(${number},${OptionalWhitespace}${number}%,${OptionalWhitespace}${number}%,${OptionalWhitespace}${number})`;

export declare type BackgroundRepeatValues2d = BackgroundRepeatValues|"repeat-x"|"repeat-y"|`${BackgroundRepeatValues} ${BackgroundRepeatValues}`;
export declare type BorderShorthand = BasicCommonValues|`${number}${AllUnits} ${BorderStyles} ${ColorFormat}`;
export declare type BackgroundImageFormat = BasicCommonValues|UrlType|`${UrlType}, ${UrlType}`;
export declare type BackgroundPositionShorthand2D = BasicCommonValues|`${BasicCommonValues|number} ${BasicCommonValues|number}`|`${number}% ${number}%`|`${"left"|"right"|"center"} ${"top"|"center"|"bottom"}`;
export declare type BackgroundShorthand = BasicCommonValues|`${ColorFormat} ${UrlType} ${BackgroundRepeatValues} ${BackgroundPositionShorthand2D}`;
export declare type FlexFlowShorthand = BasicCommonValues|`${FlexDirectionNames} ${FlexWrapNames}`;
export declare type FlexShorthand = BasicCommonValues|`${BasicCommonValues|number} ${BasicCommonValues|number} ${BasicCommonValues|`${number}${AllUnits}`}`;


export interface IDotcssProp{
	angleToDeg(a: number|string);
	matrixMultiply3D(a: Array<number>, b: Array<number>): Array<number>;
	lengthToPx(l: string|number, prop?: LengthProp, element?: Element);
	angleSubtract(a, b);
	url(url: string);
	rgb(r: number, g: number, b: number);
	rgba(r: number, g: number, b: number, a: number);
	buildTransform();
	scopeToEl(el: HTMLElement);
	cacheScopedStaticStyles(el: HTMLElement);
	clearDynamicStyles(el: HTMLElement);
	unscope();
	formatNumberValue(value: number, unit?: string);

	hide(params?: HideParams);
	show(params?: ShowParams);
	fadeOut(duration: number, complete: Function);
	fadeIn(duration: number, complete: Function);

	// Private.
	//cacheScopedStaticStyles(el: HTMLElement);
	//clearCachedStyles(el: HTMLElement);
	

	// CSS PROPS!
	// backgroundColor(values: string|Array<number>): IDotcssProp;
	// backgroundColor(r: number, g: number, b: number, a?: number): IDotcssProp;
	// color(values: string|Array<number>): IDotcssProp;
	// color(r: number, g: number, b: number, a?: number): IDotcssProp;

	// display(value: string): IDotcssProp;
	// height: IDotcssAnimatable<string|number>;
	// opacity: IDotcssAnimatable<string|number>;
	// overflow(value: string): IDotcssProp;
	// width: IDotcssAnimatable<string|number>;





	//color: 
	color: IDotcssAnimatableColor;
	backgroundColor: IDotcssAnimatableColor;
	borderBottomColor: IDotcssAnimatableColor;
	borderColor: IDotcssAnimatableColor;
	borderLeftColor: IDotcssAnimatableColor;
	borderRightColor: IDotcssAnimatableColor;
	borderTopColor: IDotcssAnimatableColor;
	textDecorationColor: IDotcssAnimatableColor;
	outlineColor: IDotcssAnimatableColor;
	columnRuleColor: IDotcssAnimatableColor;

	//length: 
	backgroundSize: ((value: BasicCommonValues)=>IDotcssProp)|IDotcssAnimatable<BackgroundSizeValues>;
	backgroundSizeCm: IDotcssAnimatable<number>;
	backgroundSizeCh: IDotcssAnimatable<number>;
	backgroundSizeEm: IDotcssAnimatable<number>;
	backgroundSizeEx: IDotcssAnimatable<number>;
	backgroundSizeIn: IDotcssAnimatable<number>;
	backgroundSizeMm: IDotcssAnimatable<number>;
	backgroundSizeP: IDotcssAnimatable<number>;
	backgroundSizePc: IDotcssAnimatable<number>;
	backgroundSizePt: IDotcssAnimatable<number>;
	backgroundSizePx: IDotcssAnimatable<number>;
	backgroundSizeRem: IDotcssAnimatable<number>;
	backgroundSizeVh: IDotcssAnimatable<number>;
	backgroundSizeVw: IDotcssAnimatable<number>;
	backgroundSizeVMax: IDotcssAnimatable<number>;
	backgroundSizeVMin: IDotcssAnimatable<number>;

	borderBottomLeftRadius: IDotcssAnimatable<number|string>;
	borderBottomLeftRadiusCm: IDotcssAnimatable<number>;
	borderBottomLeftRadiusCh: IDotcssAnimatable<number>;
	borderBottomLeftRadiusEm: IDotcssAnimatable<number>;
	borderBottomLeftRadiusEx: IDotcssAnimatable<number>;
	borderBottomLeftRadiusIn: IDotcssAnimatable<number>;
	borderBottomLeftRadiusMm: IDotcssAnimatable<number>;
	borderBottomLeftRadiusP: IDotcssAnimatable<number>;
	borderBottomLeftRadiusPc: IDotcssAnimatable<number>;
	borderBottomLeftRadiusPt: IDotcssAnimatable<number>;
	borderBottomLeftRadiusPx: IDotcssAnimatable<number>;
	borderBottomLeftRadiusRem: IDotcssAnimatable<number>;
	borderBottomLeftRadiusVh: IDotcssAnimatable<number>;
	borderBottomLeftRadiusVw: IDotcssAnimatable<number>;
	borderBottomLeftRadiusVMax: IDotcssAnimatable<number>;
	borderBottomLeftRadiusVMin: IDotcssAnimatable<number>;

	borderBottomRightRadius: IDotcssAnimatable<number|string>;
	borderBottomRightRadiusCm: IDotcssAnimatable<number>;
	borderBottomRightRadiusCh: IDotcssAnimatable<number>;
	borderBottomRightRadiusEm: IDotcssAnimatable<number>;
	borderBottomRightRadiusEx: IDotcssAnimatable<number>;
	borderBottomRightRadiusIn: IDotcssAnimatable<number>;
	borderBottomRightRadiusMm: IDotcssAnimatable<number>;
	borderBottomRightRadiusP: IDotcssAnimatable<number>;
	borderBottomRightRadiusPc: IDotcssAnimatable<number>;
	borderBottomRightRadiusPt: IDotcssAnimatable<number>;
	borderBottomRightRadiusPx: IDotcssAnimatable<number>;
	borderBottomRightRadiusRem: IDotcssAnimatable<number>;
	borderBottomRightRadiusVh: IDotcssAnimatable<number>;
	borderBottomRightRadiusVw: IDotcssAnimatable<number>;
	borderBottomRightRadiusVMax: IDotcssAnimatable<number>;
	borderBottomRightRadiusVMin: IDotcssAnimatable<number>;

	borderBottomWidth: IDotcssAnimatable<number|string>;
	borderBottomWidthCm: IDotcssAnimatable<number>;
	borderBottomWidthCh: IDotcssAnimatable<number>;
	borderBottomWidthEm: IDotcssAnimatable<number>;
	borderBottomWidthEx: IDotcssAnimatable<number>;
	borderBottomWidthIn: IDotcssAnimatable<number>;
	borderBottomWidthMm: IDotcssAnimatable<number>;
	borderBottomWidthP: IDotcssAnimatable<number>;
	borderBottomWidthPc: IDotcssAnimatable<number>;
	borderBottomWidthPt: IDotcssAnimatable<number>;
	borderBottomWidthPx: IDotcssAnimatable<number>;
	borderBottomWidthRem: IDotcssAnimatable<number>;
	borderBottomWidthVh: IDotcssAnimatable<number>;
	borderBottomWidthVw: IDotcssAnimatable<number>;
	borderBottomWidthVMax: IDotcssAnimatable<number>;
	borderBottomWidthVMin: IDotcssAnimatable<number>;

	borderImageWidth: IDotcssAnimatable<number|string>;
	borderImageWidthCm: IDotcssAnimatable<number>;
	borderImageWidthCh: IDotcssAnimatable<number>;
	borderImageWidthEm: IDotcssAnimatable<number>;
	borderImageWidthEx: IDotcssAnimatable<number>;
	borderImageWidthIn: IDotcssAnimatable<number>;
	borderImageWidthMm: IDotcssAnimatable<number>;
	borderImageWidthP: IDotcssAnimatable<number>;
	borderImageWidthPc: IDotcssAnimatable<number>;
	borderImageWidthPt: IDotcssAnimatable<number>;
	borderImageWidthPx: IDotcssAnimatable<number>;
	borderImageWidthRem: IDotcssAnimatable<number>;
	borderImageWidthVh: IDotcssAnimatable<number>;
	borderImageWidthVw: IDotcssAnimatable<number>;
	borderImageWidthVMax: IDotcssAnimatable<number>;
	borderImageWidthVMin: IDotcssAnimatable<number>;

	borderLeftWidth: IDotcssAnimatable<number|string>;
	borderLeftWidthCm: IDotcssAnimatable<number>;
	borderLeftWidthCh: IDotcssAnimatable<number>;
	borderLeftWidthEm: IDotcssAnimatable<number>;
	borderLeftWidthEx: IDotcssAnimatable<number>;
	borderLeftWidthIn: IDotcssAnimatable<number>;
	borderLeftWidthMm: IDotcssAnimatable<number>;
	borderLeftWidthP: IDotcssAnimatable<number>;
	borderLeftWidthPc: IDotcssAnimatable<number>;
	borderLeftWidthPt: IDotcssAnimatable<number>;
	borderLeftWidthPx: IDotcssAnimatable<number>;
	borderLeftWidthRem: IDotcssAnimatable<number>;
	borderLeftWidthVh: IDotcssAnimatable<number>;
	borderLeftWidthVw: IDotcssAnimatable<number>;
	borderLeftWidthVMax: IDotcssAnimatable<number>;
	borderLeftWidthVMin: IDotcssAnimatable<number>;

	borderRadius: IDotcssAnimatable<number|string>;
	borderRadiusCm: IDotcssAnimatable<number>;
	borderRadiusCh: IDotcssAnimatable<number>;
	borderRadiusEm: IDotcssAnimatable<number>;
	borderRadiusEx: IDotcssAnimatable<number>;
	borderRadiusIn: IDotcssAnimatable<number>;
	borderRadiusMm: IDotcssAnimatable<number>;
	borderRadiusP: IDotcssAnimatable<number>;
	borderRadiusPc: IDotcssAnimatable<number>;
	borderRadiusPt: IDotcssAnimatable<number>;
	borderRadiusPx: IDotcssAnimatable<number>;
	borderRadiusRem: IDotcssAnimatable<number>;
	borderRadiusVh: IDotcssAnimatable<number>;
	borderRadiusVw: IDotcssAnimatable<number>;
	borderRadiusVMax: IDotcssAnimatable<number>;
	borderRadiusVMin: IDotcssAnimatable<number>;

	borderRightWidth: IDotcssAnimatable<number|string>;
	borderRightWidthCm: IDotcssAnimatable<number>;
	borderRightWidthCh: IDotcssAnimatable<number>;
	borderRightWidthEm: IDotcssAnimatable<number>;
	borderRightWidthEx: IDotcssAnimatable<number>;
	borderRightWidthIn: IDotcssAnimatable<number>;
	borderRightWidthMm: IDotcssAnimatable<number>;
	borderRightWidthP: IDotcssAnimatable<number>;
	borderRightWidthPc: IDotcssAnimatable<number>;
	borderRightWidthPt: IDotcssAnimatable<number>;
	borderRightWidthPx: IDotcssAnimatable<number>;
	borderRightWidthRem: IDotcssAnimatable<number>;
	borderRightWidthVh: IDotcssAnimatable<number>;
	borderRightWidthVw: IDotcssAnimatable<number>;
	borderRightWidthVMax: IDotcssAnimatable<number>;
	borderRightWidthVMin: IDotcssAnimatable<number>;

	borderTopLeftRadius: IDotcssAnimatable<number|string>;
	borderTopLeftRadiusCm: IDotcssAnimatable<number>;
	borderTopLeftRadiusCh: IDotcssAnimatable<number>;
	borderTopLeftRadiusEm: IDotcssAnimatable<number>;
	borderTopLeftRadiusEx: IDotcssAnimatable<number>;
	borderTopLeftRadiusIn: IDotcssAnimatable<number>;
	borderTopLeftRadiusMm: IDotcssAnimatable<number>;
	borderTopLeftRadiusP: IDotcssAnimatable<number>;
	borderTopLeftRadiusPc: IDotcssAnimatable<number>;
	borderTopLeftRadiusPt: IDotcssAnimatable<number>;
	borderTopLeftRadiusPx: IDotcssAnimatable<number>;
	borderTopLeftRadiusRem: IDotcssAnimatable<number>;
	borderTopLeftRadiusVh: IDotcssAnimatable<number>;
	borderTopLeftRadiusVw: IDotcssAnimatable<number>;
	borderTopLeftRadiusVMax: IDotcssAnimatable<number>;
	borderTopLeftRadiusVMin: IDotcssAnimatable<number>;

	borderTopRightRadius: IDotcssAnimatable<number|string>;
	borderTopRightRadiusCm: IDotcssAnimatable<number>;
	borderTopRightRadiusCh: IDotcssAnimatable<number>;
	borderTopRightRadiusEm: IDotcssAnimatable<number>;
	borderTopRightRadiusEx: IDotcssAnimatable<number>;
	borderTopRightRadiusIn: IDotcssAnimatable<number>;
	borderTopRightRadiusMm: IDotcssAnimatable<number>;
	borderTopRightRadiusP: IDotcssAnimatable<number>;
	borderTopRightRadiusPc: IDotcssAnimatable<number>;
	borderTopRightRadiusPt: IDotcssAnimatable<number>;
	borderTopRightRadiusPx: IDotcssAnimatable<number>;
	borderTopRightRadiusRem: IDotcssAnimatable<number>;
	borderTopRightRadiusVh: IDotcssAnimatable<number>;
	borderTopRightRadiusVw: IDotcssAnimatable<number>;
	borderTopRightRadiusVMax: IDotcssAnimatable<number>;
	borderTopRightRadiusVMin: IDotcssAnimatable<number>;

	borderTopWidth: IDotcssAnimatable<number|string>;
	borderTopWidthCm: IDotcssAnimatable<number>;
	borderTopWidthCh: IDotcssAnimatable<number>;
	borderTopWidthEm: IDotcssAnimatable<number>;
	borderTopWidthEx: IDotcssAnimatable<number>;
	borderTopWidthIn: IDotcssAnimatable<number>;
	borderTopWidthMm: IDotcssAnimatable<number>;
	borderTopWidthP: IDotcssAnimatable<number>;
	borderTopWidthPc: IDotcssAnimatable<number>;
	borderTopWidthPt: IDotcssAnimatable<number>;
	borderTopWidthPx: IDotcssAnimatable<number>;
	borderTopWidthRem: IDotcssAnimatable<number>;
	borderTopWidthVh: IDotcssAnimatable<number>;
	borderTopWidthVw: IDotcssAnimatable<number>;
	borderTopWidthVMax: IDotcssAnimatable<number>;
	borderTopWidthVMin: IDotcssAnimatable<number>;

	borderWidth: IDotcssAnimatable<number|string>;
	borderWidthCm: IDotcssAnimatable<number>;
	borderWidthCh: IDotcssAnimatable<number>;
	borderWidthEm: IDotcssAnimatable<number>;
	borderWidthEx: IDotcssAnimatable<number>;
	borderWidthIn: IDotcssAnimatable<number>;
	borderWidthMm: IDotcssAnimatable<number>;
	borderWidthP: IDotcssAnimatable<number>;
	borderWidthPc: IDotcssAnimatable<number>;
	borderWidthPt: IDotcssAnimatable<number>;
	borderWidthPx: IDotcssAnimatable<number>;
	borderWidthRem: IDotcssAnimatable<number>;
	borderWidthVh: IDotcssAnimatable<number>;
	borderWidthVw: IDotcssAnimatable<number>;
	borderWidthVMax: IDotcssAnimatable<number>;
	borderWidthVMin: IDotcssAnimatable<number>;

	bottom: IDotcssAnimatable<number|string>;
	bottomCm: IDotcssAnimatable<number>;
	bottomCh: IDotcssAnimatable<number>;
	bottomEm: IDotcssAnimatable<number>;
	bottomEx: IDotcssAnimatable<number>;
	bottomIn: IDotcssAnimatable<number>;
	bottomMm: IDotcssAnimatable<number>;
	bottomP: IDotcssAnimatable<number>;
	bottomPc: IDotcssAnimatable<number>;
	bottomPt: IDotcssAnimatable<number>;
	bottomPx: IDotcssAnimatable<number>;
	bottomRem: IDotcssAnimatable<number>;
	bottomVh: IDotcssAnimatable<number>;
	bottomVw: IDotcssAnimatable<number>;
	bottomVMax: IDotcssAnimatable<number>;
	bottomVMin: IDotcssAnimatable<number>;

	height: IDotcssAnimatable<number|string>;
	heightCm: IDotcssAnimatable<number>;
	heightCh: IDotcssAnimatable<number>;
	heightEm: IDotcssAnimatable<number>;
	heightEx: IDotcssAnimatable<number>;
	heightIn: IDotcssAnimatable<number>;
	heightMm: IDotcssAnimatable<number>;
	heightP: IDotcssAnimatable<number>;
	heightPc: IDotcssAnimatable<number>;
	heightPt: IDotcssAnimatable<number>;
	heightPx: IDotcssAnimatable<number>;
	heightRem: IDotcssAnimatable<number>;
	heightVh: IDotcssAnimatable<number>;
	heightVw: IDotcssAnimatable<number>;
	heightVMax: IDotcssAnimatable<number>;
	heightVMin: IDotcssAnimatable<number>;

	left: IDotcssAnimatable<number|string>;
	leftCm: IDotcssAnimatable<number>;
	leftCh: IDotcssAnimatable<number>;
	leftEm: IDotcssAnimatable<number>;
	leftEx: IDotcssAnimatable<number>;
	leftIn: IDotcssAnimatable<number>;
	leftMm: IDotcssAnimatable<number>;
	leftP: IDotcssAnimatable<number>;
	leftPc: IDotcssAnimatable<number>;
	leftPt: IDotcssAnimatable<number>;
	leftPx: IDotcssAnimatable<number>;
	leftRem: IDotcssAnimatable<number>;
	leftVh: IDotcssAnimatable<number>;
	leftVw: IDotcssAnimatable<number>;
	leftVMax: IDotcssAnimatable<number>;
	leftVMin: IDotcssAnimatable<number>;

	margin: IDotcssAnimatable<number|string>;
	marginCm: IDotcssAnimatable<number>;
	marginCh: IDotcssAnimatable<number>;
	marginEm: IDotcssAnimatable<number>;
	marginEx: IDotcssAnimatable<number>;
	marginIn: IDotcssAnimatable<number>;
	marginMm: IDotcssAnimatable<number>;
	marginP: IDotcssAnimatable<number>;
	marginPc: IDotcssAnimatable<number>;
	marginPt: IDotcssAnimatable<number>;
	marginPx: IDotcssAnimatable<number>;
	marginRem: IDotcssAnimatable<number>;
	marginVh: IDotcssAnimatable<number>;
	marginVw: IDotcssAnimatable<number>;
	marginVMax: IDotcssAnimatable<number>;
	marginVMin: IDotcssAnimatable<number>;

	marginBottom: IDotcssAnimatable<number|string>;
	marginBottomCm: IDotcssAnimatable<number>;
	marginBottomCh: IDotcssAnimatable<number>;
	marginBottomEm: IDotcssAnimatable<number>;
	marginBottomEx: IDotcssAnimatable<number>;
	marginBottomIn: IDotcssAnimatable<number>;
	marginBottomMm: IDotcssAnimatable<number>;
	marginBottomP: IDotcssAnimatable<number>;
	marginBottomPc: IDotcssAnimatable<number>;
	marginBottomPt: IDotcssAnimatable<number>;
	marginBottomPx: IDotcssAnimatable<number>;
	marginBottomRem: IDotcssAnimatable<number>;
	marginBottomVh: IDotcssAnimatable<number>;
	marginBottomVw: IDotcssAnimatable<number>;
	marginBottomVMax: IDotcssAnimatable<number>;
	marginBottomVMin: IDotcssAnimatable<number>;

	marginLeft: IDotcssAnimatable<number|string>;
	marginLeftCm: IDotcssAnimatable<number>;
	marginLeftCh: IDotcssAnimatable<number>;
	marginLeftEm: IDotcssAnimatable<number>;
	marginLeftEx: IDotcssAnimatable<number>;
	marginLeftIn: IDotcssAnimatable<number>;
	marginLeftMm: IDotcssAnimatable<number>;
	marginLeftP: IDotcssAnimatable<number>;
	marginLeftPc: IDotcssAnimatable<number>;
	marginLeftPt: IDotcssAnimatable<number>;
	marginLeftPx: IDotcssAnimatable<number>;
	marginLeftRem: IDotcssAnimatable<number>;
	marginLeftVh: IDotcssAnimatable<number>;
	marginLeftVw: IDotcssAnimatable<number>;
	marginLeftVMax: IDotcssAnimatable<number>;
	marginLeftVMin: IDotcssAnimatable<number>;

	marginRight: IDotcssAnimatable<number|string>;
	marginRightCm: IDotcssAnimatable<number>;
	marginRightCh: IDotcssAnimatable<number>;
	marginRightEm: IDotcssAnimatable<number>;
	marginRightEx: IDotcssAnimatable<number>;
	marginRightIn: IDotcssAnimatable<number>;
	marginRightMm: IDotcssAnimatable<number>;
	marginRightP: IDotcssAnimatable<number>;
	marginRightPc: IDotcssAnimatable<number>;
	marginRightPt: IDotcssAnimatable<number>;
	marginRightPx: IDotcssAnimatable<number>;
	marginRightRem: IDotcssAnimatable<number>;
	marginRightVh: IDotcssAnimatable<number>;
	marginRightVw: IDotcssAnimatable<number>;
	marginRightVMax: IDotcssAnimatable<number>;
	marginRightVMin: IDotcssAnimatable<number>;

	marginTop: IDotcssAnimatable<number|string>;
	marginTopCm: IDotcssAnimatable<number>;
	marginTopCh: IDotcssAnimatable<number>;
	marginTopEm: IDotcssAnimatable<number>;
	marginTopEx: IDotcssAnimatable<number>;
	marginTopIn: IDotcssAnimatable<number>;
	marginTopMm: IDotcssAnimatable<number>;
	marginTopP: IDotcssAnimatable<number>;
	marginTopPc: IDotcssAnimatable<number>;
	marginTopPt: IDotcssAnimatable<number>;
	marginTopPx: IDotcssAnimatable<number>;
	marginTopRem: IDotcssAnimatable<number>;
	marginTopVh: IDotcssAnimatable<number>;
	marginTopVw: IDotcssAnimatable<number>;
	marginTopVMax: IDotcssAnimatable<number>;
	marginTopVMin: IDotcssAnimatable<number>;

	maxHeight: IDotcssAnimatable<number|string>;
	maxHeightCm: IDotcssAnimatable<number>;
	maxHeightCh: IDotcssAnimatable<number>;
	maxHeightEm: IDotcssAnimatable<number>;
	maxHeightEx: IDotcssAnimatable<number>;
	maxHeightIn: IDotcssAnimatable<number>;
	maxHeightMm: IDotcssAnimatable<number>;
	maxHeightP: IDotcssAnimatable<number>;
	maxHeightPc: IDotcssAnimatable<number>;
	maxHeightPt: IDotcssAnimatable<number>;
	maxHeightPx: IDotcssAnimatable<number>;
	maxHeightRem: IDotcssAnimatable<number>;
	maxHeightVh: IDotcssAnimatable<number>;
	maxHeightVw: IDotcssAnimatable<number>;
	maxHeightVMax: IDotcssAnimatable<number>;
	maxHeightVMin: IDotcssAnimatable<number>;

	maxWidth: IDotcssAnimatable<number|string>;
	maxWidthCm: IDotcssAnimatable<number>;
	maxWidthCh: IDotcssAnimatable<number>;
	maxWidthEm: IDotcssAnimatable<number>;
	maxWidthEx: IDotcssAnimatable<number>;
	maxWidthIn: IDotcssAnimatable<number>;
	maxWidthMm: IDotcssAnimatable<number>;
	maxWidthP: IDotcssAnimatable<number>;
	maxWidthPc: IDotcssAnimatable<number>;
	maxWidthPt: IDotcssAnimatable<number>;
	maxWidthPx: IDotcssAnimatable<number>;
	maxWidthRem: IDotcssAnimatable<number>;
	maxWidthVh: IDotcssAnimatable<number>;
	maxWidthVw: IDotcssAnimatable<number>;
	maxWidthVMax: IDotcssAnimatable<number>;
	maxWidthVMin: IDotcssAnimatable<number>;

	minHeight: IDotcssAnimatable<number|string>;
	minHeightCm: IDotcssAnimatable<number>;
	minHeightCh: IDotcssAnimatable<number>;
	minHeightEm: IDotcssAnimatable<number>;
	minHeightEx: IDotcssAnimatable<number>;
	minHeightIn: IDotcssAnimatable<number>;
	minHeightMm: IDotcssAnimatable<number>;
	minHeightP: IDotcssAnimatable<number>;
	minHeightPc: IDotcssAnimatable<number>;
	minHeightPt: IDotcssAnimatable<number>;
	minHeightPx: IDotcssAnimatable<number>;
	minHeightRem: IDotcssAnimatable<number>;
	minHeightVh: IDotcssAnimatable<number>;
	minHeightVw: IDotcssAnimatable<number>;
	minHeightVMax: IDotcssAnimatable<number>;
	minHeightVMin: IDotcssAnimatable<number>;

	minWidth: IDotcssAnimatable<number|string>;
	minWidthCm: IDotcssAnimatable<number>;
	minWidthCh: IDotcssAnimatable<number>;
	minWidthEm: IDotcssAnimatable<number>;
	minWidthEx: IDotcssAnimatable<number>;
	minWidthIn: IDotcssAnimatable<number>;
	minWidthMm: IDotcssAnimatable<number>;
	minWidthP: IDotcssAnimatable<number>;
	minWidthPc: IDotcssAnimatable<number>;
	minWidthPt: IDotcssAnimatable<number>;
	minWidthPx: IDotcssAnimatable<number>;
	minWidthRem: IDotcssAnimatable<number>;
	minWidthVh: IDotcssAnimatable<number>;
	minWidthVw: IDotcssAnimatable<number>;
	minWidthVMax: IDotcssAnimatable<number>;
	minWidthVMin: IDotcssAnimatable<number>;

	outlineOffset: IDotcssAnimatable<number|string>;
	outlineOffsetCm: IDotcssAnimatable<number>;
	outlineOffsetCh: IDotcssAnimatable<number>;
	outlineOffsetEm: IDotcssAnimatable<number>;
	outlineOffsetEx: IDotcssAnimatable<number>;
	outlineOffsetIn: IDotcssAnimatable<number>;
	outlineOffsetMm: IDotcssAnimatable<number>;
	outlineOffsetP: IDotcssAnimatable<number>;
	outlineOffsetPc: IDotcssAnimatable<number>;
	outlineOffsetPt: IDotcssAnimatable<number>;
	outlineOffsetPx: IDotcssAnimatable<number>;
	outlineOffsetRem: IDotcssAnimatable<number>;
	outlineOffsetVh: IDotcssAnimatable<number>;
	outlineOffsetVw: IDotcssAnimatable<number>;
	outlineOffsetVMax: IDotcssAnimatable<number>;
	outlineOffsetVMin: IDotcssAnimatable<number>;

	padding: IDotcssAnimatable<number|string>;
	paddingCm: IDotcssAnimatable<number>;
	paddingCh: IDotcssAnimatable<number>;
	paddingEm: IDotcssAnimatable<number>;
	paddingEx: IDotcssAnimatable<number>;
	paddingIn: IDotcssAnimatable<number>;
	paddingMm: IDotcssAnimatable<number>;
	paddingP: IDotcssAnimatable<number>;
	paddingPc: IDotcssAnimatable<number>;
	paddingPt: IDotcssAnimatable<number>;
	paddingPx: IDotcssAnimatable<number>;
	paddingRem: IDotcssAnimatable<number>;
	paddingVh: IDotcssAnimatable<number>;
	paddingVw: IDotcssAnimatable<number>;
	paddingVMax: IDotcssAnimatable<number>;
	paddingVMin: IDotcssAnimatable<number>;

	paddingBottom: IDotcssAnimatable<number|string>;
	paddingBottomCm: IDotcssAnimatable<number>;
	paddingBottomCh: IDotcssAnimatable<number>;
	paddingBottomEm: IDotcssAnimatable<number>;
	paddingBottomEx: IDotcssAnimatable<number>;
	paddingBottomIn: IDotcssAnimatable<number>;
	paddingBottomMm: IDotcssAnimatable<number>;
	paddingBottomP: IDotcssAnimatable<number>;
	paddingBottomPc: IDotcssAnimatable<number>;
	paddingBottomPt: IDotcssAnimatable<number>;
	paddingBottomPx: IDotcssAnimatable<number>;
	paddingBottomRem: IDotcssAnimatable<number>;
	paddingBottomVh: IDotcssAnimatable<number>;
	paddingBottomVw: IDotcssAnimatable<number>;
	paddingBottomVMax: IDotcssAnimatable<number>;
	paddingBottomVMin: IDotcssAnimatable<number>;

	paddingLeft: IDotcssAnimatable<number|string>;
	paddingLeftCm: IDotcssAnimatable<number>;
	paddingLeftCh: IDotcssAnimatable<number>;
	paddingLeftEm: IDotcssAnimatable<number>;
	paddingLeftEx: IDotcssAnimatable<number>;
	paddingLeftIn: IDotcssAnimatable<number>;
	paddingLeftMm: IDotcssAnimatable<number>;
	paddingLeftP: IDotcssAnimatable<number>;
	paddingLeftPc: IDotcssAnimatable<number>;
	paddingLeftPt: IDotcssAnimatable<number>;
	paddingLeftPx: IDotcssAnimatable<number>;
	paddingLeftRem: IDotcssAnimatable<number>;
	paddingLeftVh: IDotcssAnimatable<number>;
	paddingLeftVw: IDotcssAnimatable<number>;
	paddingLeftVMax: IDotcssAnimatable<number>;
	paddingLeftVMin: IDotcssAnimatable<number>;

	paddingRight: IDotcssAnimatable<number|string>;
	paddingRightCm: IDotcssAnimatable<number>;
	paddingRightCh: IDotcssAnimatable<number>;
	paddingRightEm: IDotcssAnimatable<number>;
	paddingRightEx: IDotcssAnimatable<number>;
	paddingRightIn: IDotcssAnimatable<number>;
	paddingRightMm: IDotcssAnimatable<number>;
	paddingRightP: IDotcssAnimatable<number>;
	paddingRightPc: IDotcssAnimatable<number>;
	paddingRightPt: IDotcssAnimatable<number>;
	paddingRightPx: IDotcssAnimatable<number>;
	paddingRightRem: IDotcssAnimatable<number>;
	paddingRightVh: IDotcssAnimatable<number>;
	paddingRightVw: IDotcssAnimatable<number>;
	paddingRightVMax: IDotcssAnimatable<number>;
	paddingRightVMin: IDotcssAnimatable<number>;

	paddingTop: IDotcssAnimatable<number|string>;
	paddingTopCm: IDotcssAnimatable<number>;
	paddingTopCh: IDotcssAnimatable<number>;
	paddingTopEm: IDotcssAnimatable<number>;
	paddingTopEx: IDotcssAnimatable<number>;
	paddingTopIn: IDotcssAnimatable<number>;
	paddingTopMm: IDotcssAnimatable<number>;
	paddingTopP: IDotcssAnimatable<number>;
	paddingTopPc: IDotcssAnimatable<number>;
	paddingTopPt: IDotcssAnimatable<number>;
	paddingTopPx: IDotcssAnimatable<number>;
	paddingTopRem: IDotcssAnimatable<number>;
	paddingTopVh: IDotcssAnimatable<number>;
	paddingTopVw: IDotcssAnimatable<number>;
	paddingTopVMax: IDotcssAnimatable<number>;
	paddingTopVMin: IDotcssAnimatable<number>;

	right: IDotcssAnimatable<number|string>;
	rightCm: IDotcssAnimatable<number>;
	rightCh: IDotcssAnimatable<number>;
	rightEm: IDotcssAnimatable<number>;
	rightEx: IDotcssAnimatable<number>;
	rightIn: IDotcssAnimatable<number>;
	rightMm: IDotcssAnimatable<number>;
	rightP: IDotcssAnimatable<number>;
	rightPc: IDotcssAnimatable<number>;
	rightPt: IDotcssAnimatable<number>;
	rightPx: IDotcssAnimatable<number>;
	rightRem: IDotcssAnimatable<number>;
	rightVh: IDotcssAnimatable<number>;
	rightVw: IDotcssAnimatable<number>;
	rightVMax: IDotcssAnimatable<number>;
	rightVMin: IDotcssAnimatable<number>;

	top: IDotcssAnimatable<number|string>;
	topCm: IDotcssAnimatable<number>;
	topCh: IDotcssAnimatable<number>;
	topEm: IDotcssAnimatable<number>;
	topEx: IDotcssAnimatable<number>;
	topIn: IDotcssAnimatable<number>;
	topMm: IDotcssAnimatable<number>;
	topP: IDotcssAnimatable<number>;
	topPc: IDotcssAnimatable<number>;
	topPt: IDotcssAnimatable<number>;
	topPx: IDotcssAnimatable<number>;
	topRem: IDotcssAnimatable<number>;
	topVh: IDotcssAnimatable<number>;
	topVw: IDotcssAnimatable<number>;
	topVMax: IDotcssAnimatable<number>;
	topVMin: IDotcssAnimatable<number>;

	width: IDotcssAnimatable<number|string>;
	widthCm: IDotcssAnimatable<number>;
	widthCh: IDotcssAnimatable<number>;
	widthEm: IDotcssAnimatable<number>;
	widthEx: IDotcssAnimatable<number>;
	widthIn: IDotcssAnimatable<number>;
	widthMm: IDotcssAnimatable<number>;
	widthP: IDotcssAnimatable<number>;
	widthPc: IDotcssAnimatable<number>;
	widthPt: IDotcssAnimatable<number>;
	widthPx: IDotcssAnimatable<number>;
	widthRem: IDotcssAnimatable<number>;
	widthVh: IDotcssAnimatable<number>;
	widthVw: IDotcssAnimatable<number>;
	widthVMax: IDotcssAnimatable<number>;
	widthVMin: IDotcssAnimatable<number>;

	lineHeight: IDotcssAnimatable<number|string>;
	lineHeightCm: IDotcssAnimatable<number>;
	lineHeightCh: IDotcssAnimatable<number>;
	lineHeightEm: IDotcssAnimatable<number>;
	lineHeightEx: IDotcssAnimatable<number>;
	lineHeightIn: IDotcssAnimatable<number>;
	lineHeightMm: IDotcssAnimatable<number>;
	lineHeightP: IDotcssAnimatable<number>;
	lineHeightPc: IDotcssAnimatable<number>;
	lineHeightPt: IDotcssAnimatable<number>;
	lineHeightPx: IDotcssAnimatable<number>;
	lineHeightRem: IDotcssAnimatable<number>;
	lineHeightVh: IDotcssAnimatable<number>;
	lineHeightVw: IDotcssAnimatable<number>;
	lineHeightVMax: IDotcssAnimatable<number>;
	lineHeightVMin: IDotcssAnimatable<number>;

	fontSize: IDotcssAnimatable<number|string>;
	fontSizeCm: IDotcssAnimatable<number>;
	fontSizeCh: IDotcssAnimatable<number>;
	fontSizeEm: IDotcssAnimatable<number>;
	fontSizeEx: IDotcssAnimatable<number>;
	fontSizeIn: IDotcssAnimatable<number>;
	fontSizeMm: IDotcssAnimatable<number>;
	fontSizeP: IDotcssAnimatable<number>;
	fontSizePc: IDotcssAnimatable<number>;
	fontSizePt: IDotcssAnimatable<number>;
	fontSizePx: IDotcssAnimatable<number>;
	fontSizeRem: IDotcssAnimatable<number>;
	fontSizeVh: IDotcssAnimatable<number>;
	fontSizeVw: IDotcssAnimatable<number>;
	fontSizeVMax: IDotcssAnimatable<number>;
	fontSizeVMin: IDotcssAnimatable<number>;

	flexBasis: IDotcssAnimatable<number|string>;
	flexBasisCm: IDotcssAnimatable<number>;
	flexBasisCh: IDotcssAnimatable<number>;
	flexBasisEm: IDotcssAnimatable<number>;
	flexBasisEx: IDotcssAnimatable<number>;
	flexBasisIn: IDotcssAnimatable<number>;
	flexBasisMm: IDotcssAnimatable<number>;
	flexBasisP: IDotcssAnimatable<number>;
	flexBasisPc: IDotcssAnimatable<number>;
	flexBasisPt: IDotcssAnimatable<number>;
	flexBasisPx: IDotcssAnimatable<number>;
	flexBasisRem: IDotcssAnimatable<number>;
	flexBasisVh: IDotcssAnimatable<number>;
	flexBasisVw: IDotcssAnimatable<number>;
	flexBasisVMax: IDotcssAnimatable<number>;
	flexBasisVMin: IDotcssAnimatable<number>;
	
	//url: 
	backgroundImage: (value: BackgroundImageFormat)=>IDotcssProp
	borderImage: (value: BackgroundImageFormat)=>IDotcssProp
	listStyleImage: (value: BackgroundImageFormat)=>IDotcssProp
	content: (value: BasicCommonValues|UrlType)=>IDotcssProp

	//transformation: 
	transformation
	
	//misc numeric: 
	opacity: IDotcssAnimatable<number|string>;

	//misc: 
	background: (value: BasicCommonValues|string)=>IDotcssProp
	backgroundAttachment: (value: BackgroundAttachmentValues)=>IDotcssProp
	backgroundBlendMode: (value: BasicCommonValues|string)=>IDotcssProp
	backgroundPosition: (value: BackgroundPositionShorthand2D)=>IDotcssProp
	backgroundRepeat: (value: BackgroundRepeatValues2d)=>IDotcssProp
	backgroundClip: (value: BasicCommonValues|string)=>IDotcssProp
	backgroundOrigin: (value: BackgroundOriginValues)=>IDotcssProp

	borderImageOutset: (value: BasicCommonValues|string)=>IDotcssProp
	borderImageRepeat: (value: BackgroundRepeatValues2d)=>IDotcssProp
	borderImageSlice: (value: BasicCommonValues|string)=>IDotcssProp
	borderImageSource: (value: BasicCommonValues|string)=>IDotcssProp
	
	border: (value: BorderShorthand)=>IDotcssProp
	borderBottom: (value: BorderShorthand)=>IDotcssProp
	borderLeft: (value: BorderShorthand)=>IDotcssProp
	borderRight: (value: BorderShorthand)=>IDotcssProp
	borderTop: (value: BorderShorthand)=>IDotcssProp

	borderBottomStyle: (value: BorderStyles)=>IDotcssProp
	borderLeftStyle: (value: BorderStyles)=>IDotcssProp
	borderRightStyle: (value: BorderStyles)=>IDotcssProp
	borderStyle: (value: BorderStyles)=>IDotcssProp
	borderTopStyle: (value: BorderStyles)=>IDotcssProp

	boxDecorationBreak: (value: BasicCommonValues|string)=>IDotcssProp
	boxShadow: (value: BasicCommonValues|string)=>IDotcssProp
	clear: (value: BasicCommonValues|string)=>IDotcssProp
	clip: (value: BasicCommonValues|string)=>IDotcssProp
	display: (value: DisplayValues)=>IDotcssProp
	float: (value: BasicCommonValues|string)=>IDotcssProp
	overflow: (value: BasicCommonValues|string)=>IDotcssProp
	box: (value: BasicCommonValues|string)=>IDotcssProp
	overflowX: (value: BasicCommonValues|string)=>IDotcssProp
	overflowY: (value: BasicCommonValues|string)=>IDotcssProp
	position: (value: PositionNames)=>IDotcssProp
	visibility: (value: BasicCommonValues|string)=>IDotcssProp
	verticalAlign: (value: BasicCommonValues|string)=>IDotcssProp
	zIndex: (value: string|number)=>IDotcssProp
	alignContent: (value: BasicCommonValues|string)=>IDotcssProp
	alignItems: (value: BasicCommonValues|string)=>IDotcssProp
	alignSelf: (value: BasicCommonValues|string)=>IDotcssProp
	flex: (value: FlexShorthand)=>IDotcssProp
	// flexBasis: (value: FlexBasisNames)=>IDotcssProp
	flexDirection: (value: FlexDirectionNames)=>IDotcssProp
	flexFlow: (value: FlexFlowShorthand)=>IDotcssProp
	flexGrow: (value: BasicCommonValues|number)=>IDotcssProp
	flexShrink: (value: BasicCommonValues|number)=>IDotcssProp
	flexWrap: (value: FlexWrapNames)=>IDotcssProp
	grid: (value: BasicCommonValues|string)=>IDotcssProp
	gridArea: (value: BasicCommonValues|string)=>IDotcssProp
	gridAutoColumns: (value: BasicCommonValues|string)=>IDotcssProp
	gridautoRows: (value: BasicCommonValues|string)=>IDotcssProp
	gridColumn: (value: BasicCommonValues|string)=>IDotcssProp
	gridColumnEnd: (value: BasicCommonValues|string)=>IDotcssProp
	gridColumnGap: (value: BasicCommonValues|string)=>IDotcssProp
	gridColumnStart: (value: BasicCommonValues|string)=>IDotcssProp
	gridGap: (value: BasicCommonValues|string)=>IDotcssProp
	gridRow: (value: BasicCommonValues|string)=>IDotcssProp
	gridRowEnd: (value: BasicCommonValues|string)=>IDotcssProp
	gridRowGap: (value: BasicCommonValues|string)=>IDotcssProp
	gridRowStart: (value: BasicCommonValues|string)=>IDotcssProp
	gridTemplate: (value: BasicCommonValues|string)=>IDotcssProp
	gridTemplateAreas: (value: BasicCommonValues|string)=>IDotcssProp
	gridTemplateColumns: (value: BasicCommonValues|string)=>IDotcssProp
	gridTemplateRows: (value: BasicCommonValues|string)=>IDotcssProp
	imageOrientation: (value: BasicCommonValues|string)=>IDotcssProp
	justifyContent: (value: BasicCommonValues|string)=>IDotcssProp
	order: (value: BasicCommonValues|number)=>IDotcssProp
	hangingPunctuation: (value: BasicCommonValues|string)=>IDotcssProp
	hyphens: (value: BasicCommonValues|string)=>IDotcssProp
	letterSpacing: (value: BasicCommonValues|string)=>IDotcssProp
	lineBreak: (value: BasicCommonValues|string)=>IDotcssProp
	overflowWrap: (value: BasicCommonValues|string)=>IDotcssProp
	tabSize: (value: BasicCommonValues|string)=>IDotcssProp
	textAlign: (value: BasicCommonValues|string)=>IDotcssProp
	textAlignLast: (value: BasicCommonValues|string)=>IDotcssProp
	textCombineUpright: (value: BasicCommonValues|string)=>IDotcssProp
	textIndent: (value: BasicCommonValues|string)=>IDotcssProp
	textJustify: (value: BasicCommonValues|string)=>IDotcssProp
	textTransform: (value: BasicCommonValues|string)=>IDotcssProp
	whiteSpace: (value: BasicCommonValues|string)=>IDotcssProp
	wordBreak: (value: BasicCommonValues|string)=>IDotcssProp
	wordSpacing: (value: BasicCommonValues|string)=>IDotcssProp
	wordWrap: (value: BasicCommonValues|string)=>IDotcssProp
	textDecoration: (value: BasicCommonValues|string)=>IDotcssProp
	textDecorationLine: (value: BasicCommonValues|string)=>IDotcssProp
	textDecorationStyle: (value: BasicCommonValues|string)=>IDotcssProp
	textShadow: (value: BasicCommonValues|string)=>IDotcssProp
	textUnderlinePosition: (value: BasicCommonValues|string)=>IDotcssProp
	font: (value: BasicCommonValues|string)=>IDotcssProp
	fontFamily: (value: BasicCommonValues|string)=>IDotcssProp
	fontFeatureSettings: (value: BasicCommonValues|string)=>IDotcssProp
	fontKerning: (value: BasicCommonValues|string)=>IDotcssProp
	fontLanguageOverride: (value: BasicCommonValues|string)=>IDotcssProp
	fontSizeAdjust: (value: BasicCommonValues|string)=>IDotcssProp
	fontStretch: (value: BasicCommonValues|string)=>IDotcssProp
	fontStyle: (value: FontStyleValues)=>IDotcssProp
	fontSynthesis: (value: BasicCommonValues|string)=>IDotcssProp
	fontVariant: (value: FontVariantValues)=>IDotcssProp
	fontVariantAlternates: (value: BasicCommonValues|string)=>IDotcssProp
	fontVariantCaps: (value: FontVariantCapsValues)=>IDotcssProp
	fontVariantEastAsian: (value: BasicCommonValues|string)=>IDotcssProp
	fontVariantLigatures: (value: BasicCommonValues|string)=>IDotcssProp
	fontVariantNumeric: (value: BasicCommonValues|string)=>IDotcssProp
	fontVariantPosition: (value: BasicCommonValues|string)=>IDotcssProp
	fontWeight: (value: BasicCommonValues|string)=>IDotcssProp
	direction: (value: DirectionValues)=>IDotcssProp
	textOrientation: (value: BasicCommonValues|string)=>IDotcssProp
	unicodeBidi: (value: BasicCommonValues|string)=>IDotcssProp
	userSelect: (value: BasicCommonValues|string)=>IDotcssProp
	writingMode: (value: BasicCommonValues|string)=>IDotcssProp
	borderCollapse: (value: BasicCommonValues|string)=>IDotcssProp
	borderSpacing: (value: BasicCommonValues|string)=>IDotcssProp
	captionSide: (value: BasicCommonValues|string)=>IDotcssProp
	emptyCells: (value: BasicCommonValues|string)=>IDotcssProp
	tableLayout: (value: BasicCommonValues|string)=>IDotcssProp
	counterIncrement: (value: BasicCommonValues|string)=>IDotcssProp
	counterReset: (value: BasicCommonValues|string)=>IDotcssProp
	listStyle: (value: BasicCommonValues|string)=>IDotcssProp
	listStylePosition: (value: BasicCommonValues|string)=>IDotcssProp
	listStyleType: (value: BasicCommonValues|string)=>IDotcssProp
	animation: (value: BasicCommonValues|string)=>IDotcssProp
	animationDelay: (value: BasicCommonValues|string)=>IDotcssProp
	animationDirection: (value: BasicCommonValues|string)=>IDotcssProp
	animationDuration: (value: BasicCommonValues|string)=>IDotcssProp
	animationFillMode: (value: BasicCommonValues|string)=>IDotcssProp
	animationIterationCount: (value: BasicCommonValues|string)=>IDotcssProp
	animationName: (value: BasicCommonValues|string)=>IDotcssProp
	animationPlayState: (value: BasicCommonValues|string)=>IDotcssProp
	animationTimingFunction: (value: BasicCommonValues|string)=>IDotcssProp
	backfaceVisibility: (value: BackfaceVisibilityValues)=>IDotcssProp
	perspective2d: (value: BasicCommonValues|string)=>IDotcssProp
	perspectiveOrigin: (value: BasicCommonValues|string)=>IDotcssProp
	transformOrigin: (value: BasicCommonValues|string)=>IDotcssProp
	transformStyle: (value: BasicCommonValues|string)=>IDotcssProp
	transition: (value: BasicCommonValues|string)=>IDotcssProp
	transitionProperty: (value: BasicCommonValues|string)=>IDotcssProp
	transitionDuration: (value: BasicCommonValues|string)=>IDotcssProp
	transitionTimingFunction: (value: BasicCommonValues|string)=>IDotcssProp
	transitionDelay: (value: BasicCommonValues|string)=>IDotcssProp
	boxSizing: (value: BasicCommonValues|string)=>IDotcssProp
	cursor: (value: BasicCommonValues|string)=>IDotcssProp
	imeMode: (value: BasicCommonValues|string)=>IDotcssProp
	navDown: (value: BasicCommonValues|string)=>IDotcssProp
	navIndex: (value: BasicCommonValues|string)=>IDotcssProp
	navLeft: (value: BasicCommonValues|string)=>IDotcssProp
	navRight: (value: BasicCommonValues|string)=>IDotcssProp
	navUp: (value: BasicCommonValues|string)=>IDotcssProp
	outline: (value: BorderShorthand)=>IDotcssProp
	//outlineOffset: (value: BasicCommonValues|string)=>IDotcssProp // Now animated.
	outlineStyle: (value: BorderStyles)=>IDotcssProp
	outlineWidth: (value: OutlineWidthValues)=>IDotcssProp
	resize: (value: BasicCommonValues|string)=>IDotcssProp
	textOverflow: (value: BasicCommonValues|string)=>IDotcssProp
	breakAfter: (value: BasicCommonValues|string)=>IDotcssProp
	breakBefore: (value: BasicCommonValues|string)=>IDotcssProp
	breakInside: (value: BasicCommonValues|string)=>IDotcssProp
	columnCount: (value: BasicCommonValues|string)=>IDotcssProp
	columnFill: (value: BasicCommonValues|string)=>IDotcssProp
	columnGap: (value: BasicCommonValues|string)=>IDotcssProp
	columnRule: (value: BasicCommonValues|string)=>IDotcssProp
	columnRuleStyle: (value: BasicCommonValues|string)=>IDotcssProp
	columnRuleWidth: (value: BasicCommonValues|string)=>IDotcssProp
	columnSpan: (value: BasicCommonValues|string)=>IDotcssProp
	columnWidth: (value: BasicCommonValues|string)=>IDotcssProp
	columns: (value: BasicCommonValues|string)=>IDotcssProp
	widows: (value: BasicCommonValues|string)=>IDotcssProp
	orphans: (value: BasicCommonValues|string)=>IDotcssProp
	pageBreakAfter: (value: BasicCommonValues|string)=>IDotcssProp
	pageBreakBefore: (value: BasicCommonValues|string)=>IDotcssProp
	pageBreakInside: (value: BasicCommonValues|string)=>IDotcssProp
	marks: (value: BasicCommonValues|string)=>IDotcssProp
	quotes: (value: BasicCommonValues|string)=>IDotcssProp
	filter: (value: BasicCommonValues|string)=>IDotcssProp
	imageRendering: (value: BasicCommonValues|string)=>IDotcssProp
	imageResolution: (value: BasicCommonValues|string)=>IDotcssProp
	objectFit: (value: BasicCommonValues|string)=>IDotcssProp
	objectPosition: (value: BasicCommonValues|string)=>IDotcssProp
	mask: (value: BasicCommonValues|string)=>IDotcssProp
	maskType: (value: BasicCommonValues|string)=>IDotcssProp
	mark: (value: BasicCommonValues|string)=>IDotcssProp
	markAfter: (value: BasicCommonValues|string)=>IDotcssProp
	markBefore: (value: BasicCommonValues|string)=>IDotcssProp
	phonemes: (value: BasicCommonValues|string)=>IDotcssProp
	rest: (value: BasicCommonValues|string)=>IDotcssProp
	restAfter: (value: BasicCommonValues|string)=>IDotcssProp
	restBefore: (value: BasicCommonValues|string)=>IDotcssProp
	voiceBalance: (value: BasicCommonValues|string)=>IDotcssProp
	voiceDuration: (value: BasicCommonValues|string)=>IDotcssProp
	voicePitch: (value: BasicCommonValues|string)=>IDotcssProp
	voicePitchRange: (value: BasicCommonValues|string)=>IDotcssProp
	voiceRate: (value: BasicCommonValues|string)=>IDotcssProp
	voiceStress: (value: BasicCommonValues|string)=>IDotcssProp
	voiceVolume: (value: BasicCommonValues|string)=>IDotcssProp
	marqueeDirection: (value: BasicCommonValues|string)=>IDotcssProp
	marqueePlayCount: (value: BasicCommonValues|string)=>IDotcssProp
	marqueeSpeed: (value: BasicCommonValues|string)=>IDotcssProp
	marqueeStyle: (value: BasicCommonValues|string)=>IDotcssProp
	pointerEvents: (value: BasicCommonValues|string)=>IDotcssProp
}

export default interface IDotCss extends IDotcssProp{
	(document?: Element|string): IDotcssProp;

	version: string;

}

export interface IDotcssAnimatable<T> extends IDotcssProp{
	(value: T): IDotcssProp;

	animate(value: number, duration: number, style: "ease", complete: Function): IDotcssProp;
}

export interface IDotcssAnimatableColor extends IDotcssProp{
	(value: ColorFormat|Array<number>): IDotcssProp;
	(r: number, g: number, b: number, a?: number): IDotcssProp;

	animate(value: ColorFormat|Array<number>, duration: number, style: "ease", complete: Function): IDotcssProp;
}


export interface HideParams{
	duration?: number,
	complete?: Function,
	hideStyle?: "normal"|"fade"|"shrink",
	animationStyle?: "ease",
}
export interface ShowParams{
	duration?: number,
	display?: DisplayValues, // TODO: potential to expand this.
	complete?: Function,
	opacity?: number,
	width?: number,
	height?: number,
	showStyle?: "normal"|"fade"|"grow",
	animationStyle?: "ease",
}