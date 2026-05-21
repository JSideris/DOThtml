import IDotcssProp from "../i-css-prop";

export default interface IAtPageBuilder extends IDotcssProp{
	topLeftCorner: IDotcssProp;
	topLeft: IDotcssProp;
	topCenter: IDotcssProp;
	topRight: IDotcssProp;
	topRightCorner: IDotcssProp;
	bottomLeftCorner: IDotcssProp;
	bottomLeft: IDotcssProp;
	bottomCenter: IDotcssProp;
	bottomRight: IDotcssProp;
	bottomRightCorner: IDotcssProp;
	leftTop: IDotcssProp;
	leftMiddle: IDotcssProp;
	leftBottom: IDotcssProp;
	rightTop: IDotcssProp;
	rightMiddle: IDotcssProp;
	rightBottom: IDotcssProp;
}