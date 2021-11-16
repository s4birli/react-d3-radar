import React from "react";
import * as d3 from "d3";
import * as _ from "lodash";
import { MainType, DimensionsType } from "./index.interface";
import { Table22 } from "./Lookup";

export interface Props {
  data: MainType[];
  dimensions?: DimensionsType;
}

export interface State {
  width: number;
  height: number;
}

export default class BubbleRadar extends React.Component<Props, State> {
  public static defaultProps = {
    dimensions: {
      margin: { left: 10, right: 10, top: 10, bottom: 10 },
      width: 600,
      height: 600,
    },
  };

  svgRef;
  totalSize: number = 5;
  radius: number = 0;
  unit;
  table22 = Table22;
  color;
  scaleRadius;

  constructor(props: Props) {
    super(props);
    this.svgRef = React.createRef<SVGSVGElement>();
    const { width, height, margin } = props.dimensions as DimensionsType;
    const newWidth = width + (margin.left ?? 0) + (margin.right ?? 0);
    const newHeight = height + (margin.top ?? 0) + (margin.bottom ?? 0);

    this.state = {
      width: newWidth,
      height: newHeight,
    };

    this.radius = height / 2;

    this.unit = d3
      .scaleLinear()
      .domain([0, this.totalSize])
      .range([0, this.radius]);
    this.color = d3
      .scaleLinear<string>()
      .domain([1, 2, 3, 4, 5])
      .range(["#6bc3ce", "#01a778", "#7ba448", "#f6a118", "#e31c4b"]);

    // this.maxValue = d3.max(props.data, (item) => item.total);
    // this.minValue = d3.min
    this.scaleRadius = d3
      .scaleLinear()
      .domain([
        d3.min(props.data, (item) => item.total) as number,
        d3.max(props.data, (item) => item.total) as number,
      ])
      .range([10, 25]);
  }

  componentDidMount() {
    this.setState({});

    const svgEl = d3.select(this.svgRef.current);

    svgEl.selectAll("*").remove();
    this.drawRing(svgEl);
    this.drawBubble(svgEl);
  }

  drawBubble(
    svgEl: d3.Selection<SVGSVGElement | null, unknown, null, undefined>
  ) {
    const circles = svgEl
      .selectAll("circle")
      .data(
        this.props.data
          .map((item) => {
            item.radian =
              (item.subCategoryIndex ?? 0) * this.table22.vLookup(item.type, 3);
            return item;
          })
          .sort((a, b) => a.total - b.total)
      )
      .enter()
      .append("circle")
      .attr(
        "cx",
        (item) =>
          this.state.height / 2 +
          Math.cos(item.radian ?? 0) *
            this.unit(6 - item.probability) *
            this.table22.vLookup(item.type, 4)
      )
      .attr(
        "cy",
        (item) =>
          this.state.height / 2 -
          Math.sin(item.radian ?? 0) *
            this.unit(6 - item.probability) *
            this.table22.vLookup(item.type, 5)
      )
      .attr("r", 0)
      .attr("fill", (item) => this.color(item.impact))
      .attr("stroke", (item) =>
        d3.rgb(this.color(item.impact)).brighter(0.5).toString()
      );

    circles
      .transition()
      .duration(1000)
      .attr("fill-opacity", 1)
      .attr("r", (item) => this.scaleRadius(item.total))
      .attr("stroke-width", 2);
  }

  drawRing(
    svgEl: d3.Selection<SVGSVGElement | null, unknown, null, undefined>
  ) {
    svgEl
      .selectAll("circle")
      .data(_.range(this.totalSize))
      .enter()
      .append("circle")
      .style("stroke", "#3a9593")
      .style("fill", "none")
      .attr("r", (d) => this.unit(d + 1))
      .attr("cx", this.state.height / 2)
      .attr("cy", this.state.height / 2)
      .attr("stroke-width", (d) => d * 2 + 1);

    svgEl
      .append("line")
      .style("stroke", "#3a9593")
      .attr("x1", this.state.width / 2)
      .attr("y1", 0)
      .attr("x2", this.state.width / 2)
      .attr("y2", this.state.height);

    svgEl
      .append("line")
      .style("stroke", "#3a9593")
      .attr("x1", 0)
      .attr("y1", this.state.height / 2)
      .attr("x2", this.state.width)
      .attr("y2", this.state.height / 2);
  }

  render() {
    return (
      <>
        <div className="bubble-container">
          <span className="people-and-process">
            People <br /> and <br /> Process
          </span>
          <span className="data-and-access">
            Data <br /> and <br /> Access
          </span>
          <span className="asset-and-asset">Asset</span>
          <span className="technology">Technology</span>
          <div className="impact-container">
            <span>Impact</span>
            <div className="impact-item">
              <span className="impact-1"></span> {"  "} 1
            </div>
            <div className="impact-item">
              <span className="impact-2"></span> {"  "} 2
            </div>
            <div className="impact-item">
              <span className="impact-3"></span> {"  "} 3
            </div>
            <div className="impact-item">
              <span className="impact-4"></span> {"  "} 4
            </div>
            <div className="impact-item">
              <span className="impact-5"></span> {"  "} 5
            </div>
          </div>
          <h1 className="title">Risk Radar</h1>
          <div className="svg-container">
            <svg
              ref={this.svgRef}
              width={this.state.width}
              height={this.state.height}
            ></svg>
          </div>
        </div>
      </>
    );
  }
}
