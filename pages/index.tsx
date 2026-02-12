import dynamic from 'next/dynamic'

import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState, useRef } from 'react'
import { Selector, Form, Slider, Button, Input } from 'antd-mobile';
import { GoogleAnalytics } from '@next/third-parties/google'


import { useTranslation } from 'react-i18next';
import i18n from '../src/i18n';
import styles from '../styles/Home.module.css'
import { t } from 'i18next';
import React from 'react';
import { useStickyState } from '../utils/useStickyState';
import { GameList } from '../src/games';


// ===== 画布和显示相关常量 =====
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 578;
const CANVAS_PADDING = 0; // canvas边缘留白
const BACKGROUND_COLOR = '#ffffff';
const TEXT_COLOR = '#666666';

// ===== 图片尺寸常量 =====
const ORIGINAL_TOP_IMAGE_WIDTH = 600;
const ORIGINAL_TOP_IMAGE_HEIGHT = 289;
const ORIGINAL_SIDE_IMAGE_HEIGHT = 289;
const SIDE_IMAGE_START_Y = ORIGINAL_TOP_IMAGE_HEIGHT; // side image在canvas中的起始Y坐标

// ===== 车辆和人头位置常量 =====
const CAR_LENGTH = 424; // centimetres, used to calculate scale for monitors
const HEAD_NORM_X = 0.555; // 头部X位置的归一化值 (0-1)
const HEAD_NORM_TOP_Y = 0.67; // 头部在俯视图中Y位置的归一化值 (0-1)
const HEAD_NORM_SIDE_Y = 0.49; // 头部在侧视图中Y位置的归一化值 (0-1)
const HEAD_SIZE = 6; // 头部圆点的半径
const xOffset = 0; // X轴偏移量

// ===== 显示器绘制相关常量 =====
const MONITOR_COLOR = '#f00';
const MONITOR_THICKNESS = 5;

// ===== 绘图样式常量 =====
const ALPHA_SEMI_TRANSPARENT = 0.5;
const ALPHA_TRANSPARENT = 0.7;
const ALPHA_OPAQUE = 1;
const LINE_WIDTH_THIN = 1;
const DASH_PATTERN = [5, 5]; // 虚线样式

// ===== 文本和标注相关常量 =====
const TEXT_SIZE = 10;
const FONT_SIZE_SPEC = 15;
const FONT_FAMILY = "Arial";
const WATERMARK_TEXT = "fovcalc.xusf.xyz";

// ===== 标注边距和偏移量常量 =====
const ANNOTATION_MARGIN_LEFT_RIGHT = 50; // 左右标注需要的空间
const ANNOTATION_MARGIN_TOP_BOTTOM = 10; // 上下方向的标注空间
const DISTANCE_LINE_GAP_NEAR = 32; // 距离线靠近头部的间隙
const DISTANCE_LINE_GAP_FAR = 5; // 距离线远离头部的间隙
const DISTANCE_TEXT_OFFSET = 5; // 距离文本的偏移
const CALIBRATION_LINE_LENGTH = 20; // 校准线的长度
const ANGLE_TEXT_OFFSET_X = -30; // 角度文本X偏移
const ANGLE_TEXT_OFFSET_Y = 0; // 角度文本Y偏移
const SPEC_TEXT_OFFSET_X = 10; // 规格文本X偏移
const SPEC_TEXT_LINE1_OFFSET_Y = 30; // 规格文本第一行Y偏移
const SPEC_TEXT_LINE2_OFFSET_Y = 10; // 规格文本第二行Y偏移
const WATERMARK_TOP_X = 370; // 水印顶部X位置
const WATERMARK_TOP_Y = 15; // 水印顶部Y位置
const WATERMARK_BOTTOM_X = 170; // 水印底部X位置
const SIDE_MONITOR_CALIBRATION_OFFSET = 12; // 侧视图显示器校准线偏移

// ===== 距离和FOV相关常量 =====
const MIN_DISTANCE_TO_SCREEN = 10; // 最小屏幕距离（厘米）
const MAX_DISTANCE_TO_SCREEN = 400; // 最大屏幕距离（厘米）
const GT7_TARGET_VFOV = 55; // GT7车内视角固定垂直FOV（度）
const GT7_BINARY_SEARCH_ITERATIONS = 50; // GT7模式二分查找迭代次数
const GT7_FOV_TOLERANCE = 0.1; // GT7 FOV容差（度）
const GT7_DISTANCE_UPDATE_THRESHOLD = 0.5; // GT7距离更新阈值（厘米）

// ===== 距离滑块非线性映射常量 =====
// 实际值范围: 10-400, 滑块值范围: 0-100
const SLIDER_RANGE1_DISTANCE_MIN = 10;  // 第一段距离最小值
const SLIDER_RANGE1_DISTANCE_MAX = 50;  // 第一段距离最大值
const SLIDER_RANGE1_SLIDER_MIN = 0;     // 第一段滑块最小值
const SLIDER_RANGE1_SLIDER_MAX = 10;    // 第一段滑块最大值

const SLIDER_RANGE2_DISTANCE_MIN = 50;  // 第二段距离最小值
const SLIDER_RANGE2_DISTANCE_MAX = 100; // 第二段距离最大值
const SLIDER_RANGE2_SLIDER_MIN = 10;    // 第二段滑块最小值
const SLIDER_RANGE2_SLIDER_MAX = 70;    // 第二段滑块最大值

const SLIDER_RANGE3_DISTANCE_MIN = 100; // 第三段距离最小值
const SLIDER_RANGE3_DISTANCE_MAX = 200; // 第三段距离最大值
const SLIDER_RANGE3_SLIDER_MIN = 70;    // 第三段滑块最小值
const SLIDER_RANGE3_SLIDER_MAX = 90;    // 第三段滑块最大值

const SLIDER_RANGE4_DISTANCE_MIN = 200; // 第四段距离最小值
const SLIDER_RANGE4_DISTANCE_MAX = 400; // 第四段距离最大值
const SLIDER_RANGE4_SLIDER_MIN = 90;    // 第四段滑块最小值
const SLIDER_RANGE4_SLIDER_MAX = 100;   // 第四段滑块最大值

// ===== UI控件范围常量 =====
const MIN_TRIPLE_MONITOR_ANGLE = 0;     // 三联屏最小角度
const MAX_TRIPLE_MONITOR_ANGLE = 90;    // 三联屏最大角度
const MIN_SCREEN_SIZE = 5;              // 最小屏幕尺寸（英寸）
const MAX_SCREEN_SIZE = 110;            // 最大屏幕尺寸（英寸）
const SLIDER_VALUE_MIN = 0;             // 滑块最小值
const SLIDER_VALUE_MAX = 100;           // 滑块最大值

// ===== 单位转换常量 =====
const INCH_TO_CM = 2.54;                // 英寸到厘米的转换系数
const DEGREES_TO_RADIANS = Math.PI / 180; // 角度到弧度的转换系数
const FULL_CIRCLE_DEGREES = 360;        // 一个完整圆的角度

// ===== 游戏FOV计算常量 =====
// Codemasters F1 系列
const CMF1_BASE_ANGLE = 77;             // CM F1 基准角度
const CMF1_16_18_SCALE = 0.05;          // CM F1 2016-2018 缩放系数
const CMF1_16_18_MIN = -1;              // CM F1 2016-2018 最小值
const CMF1_16_18_MAX = 1;               // CM F1 2016-2018 最大值
const CMF1_19_20_SCALE = 0.1;           // CM F1 2019-2020 缩放系数
const CMF1_19_20_MIN = -10;             // CM F1 2019-2020 最小值
const CMF1_19_20_MAX = 10;              // CM F1 2019-2020 最大值
const CMF1_21_SCALE = 1;                // CM F1 2021 缩放系数
const CMF1_21_MIN = -20;                // CM F1 2021 最小值
const CMF1_21_MAX = 20;                 // CM F1 2021 最大值

// GTR2 和 Race07
const GTR2_VFOV_DIVISOR = 58;           // GTR2 垂直FOV除数
const GTR2_MIN = 0.5;                   // GTR2 最小值
const GTR2_MAX = 1.5;                   // GTR2 最大值
const RACE07_VFOV_DIVISOR = 58;         // Race07 垂直FOV除数
const RACE07_MIN = 0.4;                 // Race07 最小值
const RACE07_MAX = 1.5;                 // Race07 最大值

// Dirt Rally
const DIRT_RALLY_MIN_VFOV = 30;         // Dirt Rally 最小垂直FOV
const DIRT_RALLY_MAX_VFOV = 70;         // Dirt Rally 最大垂直FOV
const DIRT_RALLY_STEP = 5;              // Dirt Rally FOV步进值

// top view的安全区域
const TOP_VIEW_SAFE_AREA = {
  minX: 0,
  maxX: ORIGINAL_TOP_IMAGE_WIDTH,
  minY: 0,
  maxY: ORIGINAL_TOP_IMAGE_HEIGHT,
};

// side view的安全区域
const SIDE_VIEW_SAFE_AREA = {
  minX: 0,
  maxX: ORIGINAL_TOP_IMAGE_WIDTH,
  minY: SIDE_IMAGE_START_Y,
  maxY: SIDE_IMAGE_START_Y + ORIGINAL_SIDE_IMAGE_HEIGHT,
};


let headPositions = {
  normX: HEAD_NORM_X, // normalized value, 0-1
  normTY: HEAD_NORM_TOP_Y,
  normSY: HEAD_NORM_SIDE_Y,
  x: 0,
  ty: 0,
  sy: 0,
};
let carScale = 1;
let imageScale = 1; // 统一的图片缩放比例

const getImage = (src: string) => new Promise<HTMLImageElement>((resolve) => {
  const topImage = new Image()
  topImage.src = src;
  topImage.onload = () => {
    resolve(topImage)
  }
})

const loadImage = async (ctx: CanvasRenderingContext2D, scale: number = 1) => {
  console.log('load images', 'scale:', scale)

  const currPath = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/${window.location.pathname}`;
  const topImage = await getImage(`${currPath}/assets/images/brz_top.jpg`)
  const sideImage = await getImage(`${currPath}/assets/images/brz_side.jpg`)

  // fill canvas with white background
  ctx.globalAlpha = ALPHA_OPAQUE;
  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.globalAlpha = ALPHA_SEMI_TRANSPARENT;

  // 原始head位置
  const originalHeadX = topImage.width * headPositions.normX;
  const originalHeadTY = topImage.height * headPositions.normTY;
  const originalHeadSY = sideImage.height * headPositions.normSY;

  // 缩放后的尺寸（两张图片使用统一缩放）
  const scaledTopWidth = topImage.width * scale;
  const scaledTopHeight = topImage.height * scale;
  const scaledSideWidth = topImage.width * scale;
  const scaledSideHeight = sideImage.height * scale;
  const scaledGap = 80 * scale;

  // 计算绘制位置，使head位置保持在原位
  // top view: 以head为中心缩放
  const topDrawX = originalHeadX - (originalHeadX * scale);
  const topDrawY = originalHeadTY - (originalHeadTY * scale);

  // side view: 以head为中心缩放
  const sideDrawX = originalHeadX - (originalHeadX * scale);
  const sideDrawY = topImage.height + 0 + originalHeadSY - (originalHeadSY * scale);

  ctx.drawImage(topImage, topDrawX, topDrawY, scaledTopWidth, scaledTopHeight);
  ctx.drawImage(sideImage, sideDrawX, sideDrawY, scaledSideWidth, scaledSideHeight);

  console.log(topImage.height, topImage.width)

  // head位置保持不变
  headPositions.x = originalHeadX;
  headPositions.ty = originalHeadTY;
  headPositions.sy = topImage.height + originalHeadSY;

  // carScale需要考虑缩放比例
  carScale = scaledTopWidth / CAR_LENGTH

  imageScale = scale;

  console.log('load images complete', 'carScale:', carScale)

}

const drawHeads = (ctx: CanvasRenderingContext2D) => {
  console.log("draw heads");
  ctx.globalAlpha = ALPHA_OPAQUE;
  ctx.fillStyle = MONITOR_COLOR;

  var pi2 = Math.PI * 2;
  var headX = headPositions.x + xOffset;
  var headTY = headPositions.ty;
  var headSY = headPositions.sy;

  ctx.beginPath();
  ctx.arc(headX, headTY, HEAD_SIZE, 0, pi2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(headX, headSY, HEAD_SIZE, 0, pi2);
  ctx.fill();

  ctx.save();
}

const drawVerticalArc = (
  ctx: CanvasRenderingContext2D,
  x: number,
  fromY: number,
  toY: number,
  radius: number,
) => {
  ctx.globalAlpha = ALPHA_TRANSPARENT;
  ctx.strokeStyle = MONITOR_COLOR;

  ctx.beginPath();
  const yLen = (toY - fromY) / 2;
  const angle = Math.asin(yLen / radius);
  const cosX = radius * Math.cos(angle);
  const centerX = x + cosX;
  const centerY = fromY + yLen;
  ctx.arc(centerX, centerY, radius, Math.PI - angle, Math.PI + angle, false);

  ctx.stroke();
}

const drawLine = (
  ctx: CanvasRenderingContext2D,
  x: number,
  fromY: number,
  toY: number,
) => {
  ctx.globalAlpha = ALPHA_TRANSPARENT;
  ctx.strokeStyle = MONITOR_COLOR;

  ctx.beginPath();
  ctx.moveTo(x, fromY);
  ctx.lineTo(x, toY);
  ctx.stroke();
}

const drawDistanceLine = (
  ctx: CanvasRenderingContext2D,
  topMonX: number,
  headX: number,
  headSY: number,
  distanceToScreen: number,
) => {
  ctx.globalAlpha = ALPHA_TRANSPARENT;
  ctx.strokeStyle = MONITOR_COLOR;

  ctx.setLineDash(DASH_PATTERN);
  ctx.beginPath();
  ctx.moveTo(topMonX, headSY);
  ctx.lineTo(headX - DISTANCE_LINE_GAP_NEAR, headSY);
  ctx.moveTo(headX - DISTANCE_LINE_GAP_FAR, headSY);
  ctx.lineTo(headX, headSY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.globalAlpha = ALPHA_OPAQUE;
  ctx.fillText(`${distanceToScreen} cm`, topMonX + DISTANCE_TEXT_OFFSET, headSY - TEXT_SIZE / 2)
}

const drawAngle = (
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  textOffsetX: number,
  textOffsetY: number,
  angleNum: number = 0,
  angleNumOffsetX: number = 0
) => {
  ctx.globalAlpha = ALPHA_OPAQUE;
  ctx.strokeStyle = MONITOR_COLOR;

  ctx.lineWidth = LINE_WIDTH_THIN;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(fromX, fromY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  if (fromX === toX) {
    ctx.globalAlpha = ALPHA_OPAQUE;
    ctx.fillText(`${angleNum}\u00b0`, centerX + textOffsetX + angleNumOffsetX, centerY + textOffsetY + TEXT_SIZE / 2)
  }
}

const drawLengthCalibration = (
  ctx: CanvasRenderingContext2D,
  totalWidth: number,

  centerY: number,
  toX: number,
) => {
  ctx.globalAlpha = ALPHA_TRANSPARENT;
  ctx.strokeStyle = MONITOR_COLOR;

  ctx.lineWidth = LINE_WIDTH_THIN;

  ctx.setLineDash(DASH_PATTERN);
  ctx.beginPath();
  ctx.moveTo(toX, centerY - totalWidth / 2);
  ctx.lineTo(toX, centerY + totalWidth / 2);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.beginPath();
  ctx.moveTo(toX - CALIBRATION_LINE_LENGTH, centerY - totalWidth / 2);
  ctx.lineTo(toX + CALIBRATION_LINE_LENGTH, centerY - totalWidth / 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(toX - CALIBRATION_LINE_LENGTH, centerY + totalWidth / 2);
  ctx.lineTo(toX + CALIBRATION_LINE_LENGTH, centerY + totalWidth / 2);
  ctx.stroke();

  ctx.globalAlpha = ALPHA_OPAQUE;
  ctx.fillText(`${(totalWidth / carScale + 2).toFixed(1)} cm`, toX, centerY - totalWidth / 2 - TEXT_SIZE / 2)
}

const drawSpecText = (
  ctx: CanvasRenderingContext2D,
  screenSize: number,
  isTripleMonitor: boolean,
  tripleMonitorAngle: number,
  aspectRatioA: number,
  aspectRatioB: number,
  curvature: number,
  headSY: number,
) => {
  ctx.globalAlpha = ALPHA_OPAQUE;
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = `${FONT_SIZE_SPEC}px ${FONT_FAMILY}`;
  ctx.fillText(`${screenSize}${t("inch")} ${isTripleMonitor ? `${t("tripleMonitor")} ${tripleMonitorAngle}\u00B0 ${t("angle")}` : ""}`, SPEC_TEXT_OFFSET_X, headSY - SPEC_TEXT_LINE1_OFFSET_Y);
  ctx.fillText(`${aspectRatioA}:${aspectRatioB} ${curvature > 0 ? `${curvature}0R` : t("flat")}`, SPEC_TEXT_OFFSET_X, headSY - SPEC_TEXT_LINE2_OFFSET_Y);
}

const drawWatermark = (ctx: CanvasRenderingContext2D) => {
  ctx.globalAlpha = ALPHA_SEMI_TRANSPARENT;
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = `${FONT_SIZE_SPEC}px ${FONT_FAMILY}`;
  ctx.fillText(WATERMARK_TEXT, WATERMARK_TOP_X, WATERMARK_TOP_Y);
  ctx.fillText(WATERMARK_TEXT, WATERMARK_BOTTOM_X, CANVAS_HEIGHT - SPEC_TEXT_LINE2_OFFSET_Y);
}

const drawMonitors = (
  ctx: CanvasRenderingContext2D,
  curveRadius: number, // cm
  isTripleMonitor: boolean,
  monitorInfo: any,
  displayPos: any,
  verticalAngleNum: number,
  horizontalSingleAngleNum: number,
  horizontalTripleAngleNum: number,
  totalWidth: number,
  distanceToScreen: number,
) => {
  console.log("draw monitors");
  ctx.globalAlpha = ALPHA_SEMI_TRANSPARENT;
  ctx.strokeStyle = MONITOR_COLOR;

  const {
    headX,
    headTY,
    headSY,
    topMonX,
    sideMonX,
    monTY,
    monSY,
    monLeftY,
    monRightY,
    tripleAngle,
  } = displayPos;

  // side view, center monitor front
  ctx.lineWidth = MONITOR_THICKNESS;
  drawLine(ctx, sideMonX, monSY, monSY + monitorInfo.h);
  drawAngle(ctx, headX, headSY, sideMonX, monSY, sideMonX, monSY + monitorInfo.h, ANGLE_TEXT_OFFSET_X, ANGLE_TEXT_OFFSET_Y, verticalAngleNum);
  drawDistanceLine(ctx, topMonX, headX, headSY, distanceToScreen);

  drawLengthCalibration(ctx, monitorInfo.h, headSY, sideMonX - SIDE_MONITOR_CALIBRATION_OFFSET);

  // top view, center monitor
  ctx.lineWidth = MONITOR_THICKNESS;
  if (curveRadius <= 0) {
    drawLine(ctx, topMonX, monTY, monTY + monitorInfo.w);
  } else {
    drawVerticalArc(ctx, topMonX, monTY, monTY + monitorInfo.w, curveRadius * carScale);
  }
  drawAngle(ctx, headX, headTY, topMonX, monTY, topMonX, monTY + monitorInfo.w, ANGLE_TEXT_OFFSET_X, ANGLE_TEXT_OFFSET_Y, horizontalSingleAngleNum);

  let topViewSidePointX = topMonX - SIDE_MONITOR_CALIBRATION_OFFSET;

  if (isTripleMonitor) {
    // top view, left monitor
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(topMonX + MONITOR_THICKNESS / 2, monLeftY);
    ctx.rotate(-tripleAngle * DEGREES_TO_RADIANS);
    ctx.translate(-topMonX - MONITOR_THICKNESS / 2, -monLeftY);
    ctx.lineWidth = MONITOR_THICKNESS;

    if (curveRadius <= 0) {
      drawLine(ctx, topMonX, monLeftY, monLeftY + monitorInfo.w);
    } else {
      drawVerticalArc(ctx, topMonX, monLeftY, monLeftY + monitorInfo.w, curveRadius * carScale);
    }

    // top view, right monitor
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(topMonX + MONITOR_THICKNESS / 2, monRightY);
    ctx.rotate(tripleAngle * DEGREES_TO_RADIANS);
    ctx.translate(-topMonX - MONITOR_THICKNESS / 2, -monRightY);
    ctx.lineWidth = MONITOR_THICKNESS;

    if (curveRadius <= 0) {
      drawLine(ctx, topMonX, monRightY - monitorInfo.w, monRightY);
    } else {
      drawVerticalArc(ctx, topMonX, monRightY - monitorInfo.w, monRightY, curveRadius * carScale);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const sinX = monitorInfo.w * Math.sin(tripleAngle * DEGREES_TO_RADIANS)
    const cosY = monitorInfo.w * Math.cos(tripleAngle * DEGREES_TO_RADIANS)
    drawAngle(ctx, headX, headTY, topMonX + sinX, monTY - cosY, topMonX + sinX, monTY + monitorInfo.w + cosY, ANGLE_TEXT_OFFSET_X, ANGLE_TEXT_OFFSET_Y, horizontalTripleAngleNum, 40);

    topViewSidePointX = topMonX + sinX;
  }

  drawLengthCalibration(ctx, totalWidth, headTY, topViewSidePointX);


}

const getMonitor = (screenSize: number, aspectRatio: number, curveRadius: number, customCarScale?: number): any => {
  // 使用传入的carScale，如果没有传入则使用全局的
  const useCarScale = customCarScale !== undefined ? customCarScale : carScale;

  const realWidth = (INCH_TO_CM * screenSize) * (aspectRatio / Math.sqrt(1 + aspectRatio * aspectRatio))
  const realHeight = realWidth / aspectRatio
  const width = useCarScale * realWidth
  const height = useCarScale * realHeight

  const mon = {
    thickness: 0,
    h: 0,
    w: 0,
    curveAngle: 0,
  }
  if (curveRadius <= 0) {

    mon.h = height
    mon.w = width
  } else {
    mon.h = height
    console.log('real width', realWidth)
    const angle = realWidth / (curveRadius * 2 * Math.PI) * FULL_CIRCLE_DEGREES * DEGREES_TO_RADIANS
    console.log("angle", angle)
    const boxDepth = curveRadius - curveRadius * Math.cos(angle / 2)
    const boxWidth = curveRadius * Math.sin(angle / 2) * 2
    mon.thickness = boxDepth * useCarScale
    mon.w = boxWidth * useCarScale
    mon.curveAngle = angle
  }
  console.log("monitor info", mon)
  return mon
}

const calcAngleNum = (
  centerX: number,
  centerY: number,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
): number => {
  if (fromX !== toX) {
    // won't calculate
    return -1
  }
  const yDiff = Math.abs(fromY - toY)
  const radius = Math.sqrt((fromX - centerX) ** 2 + (fromY - centerY) ** 2)
  const angle = Math.abs(Math.asin(yDiff / 2 / radius));
  const angleNum = angle / DEGREES_TO_RADIANS * 2;

  if (centerX < fromX) {
    return FULL_CIRCLE_DEGREES - angleNum;
  }
  return angleNum;
}

const calculateDisplayXYPos = (
  distanceToScreen: number,
  monitorInfo: any,
  tripleMonitorAngle: number,
) => {
  var headX = headPositions.x + xOffset;
  var headTY = headPositions.ty;
  var headSY = headPositions.sy;

  var topMonX = headX - distanceToScreen * carScale + monitorInfo.thickness;
  var sideMonX = headX - distanceToScreen * carScale;

  var monTY = headTY - monitorInfo.w / 2;
  var monSY = headSY - monitorInfo.h / 2;
  var tripleAngle = tripleMonitorAngle;

  var monLeftY = headTY + monitorInfo.w / 2;
  var monRightY = headTY - monitorInfo.w / 2;

  return {
    headX,
    headTY,
    headSY,
    topMonX,
    sideMonX,
    monTY,
    monSY,
    monLeftY,
    monRightY,
    tripleAngle,
  }
}

// 计算需要的统一缩放比例，只有当drawMonitors超出安全区域时才缩放
const calculateRequiredScale = (
  displayPos: any,
  monitorInfo: any,
  isTripleMonitor: boolean,
  tripleMonitorAngle: number,
  distanceToScreen: number,
) => {
  const { topMonX, monTY, monSY, headX, headTY, headSY } = displayPos;

  // ===== 计算top view的monitor绘制边界 (俯视图) =====
  // 中间屏幕的边界
  let topCenterMinX = topMonX;
  let topCenterMaxX = headX;
  let topCenterMinY = monTY;
  let topCenterMaxY = monTY + monitorInfo.w;

  // 最终边界（包含三联屏）
  let topMinX = topCenterMinX;
  let topMaxX = topCenterMaxX;
  let topMinY = topCenterMinY;
  let topMaxY = topCenterMaxY;

  if (isTripleMonitor) {
    const sinX = monitorInfo.w * Math.sin(tripleMonitorAngle * DEGREES_TO_RADIANS);
    const cosY = monitorInfo.w * Math.cos(tripleMonitorAngle * DEGREES_TO_RADIANS);

    // 左右屏幕的Y方向边界
    const leftScreenMinY = monTY - cosY;
    const rightScreenMaxY = monTY + monitorInfo.w + cosY;
    topMinY = Math.min(topCenterMinY, leftScreenMinY);
    topMaxY = Math.max(topCenterMaxY, rightScreenMaxY);

    // 左右屏幕的X方向边界
    const leftScreenMinX = topMonX - sinX;  // 左屏幕向左延伸
    const rightScreenMaxX = topMonX + sinX; // 右屏幕向右延伸
    topMinX = Math.min(topCenterMinX, leftScreenMinX);
    topMaxX = Math.max(topCenterMaxX, rightScreenMaxX);
  }

  // 添加边距后的最终边界
  const topMinXWithMargin = topMinX - ANNOTATION_MARGIN_LEFT_RIGHT;
  const topMaxXWithMargin = topMaxX + ANNOTATION_MARGIN_LEFT_RIGHT;
  const topMinYWithMargin = topMinY - ANNOTATION_MARGIN_TOP_BOTTOM;
  const topMaxYWithMargin = topMaxY + ANNOTATION_MARGIN_TOP_BOTTOM;

  // ===== 计算side view的monitor绘制边界 (侧视图) =====
  const sideMinX = displayPos.sideMonX;
  const sideMaxX = headX;
  const sideMinY = monSY;
  const sideMaxY = monSY + monitorInfo.h;

  // 添加边距后的最终边界
  const sideMinXWithMargin = sideMinX - ANNOTATION_MARGIN_LEFT_RIGHT;
  const sideMaxXWithMargin = sideMaxX + ANNOTATION_MARGIN_LEFT_RIGHT;
  const sideMinYWithMargin = sideMinY - ANNOTATION_MARGIN_TOP_BOTTOM;
  const sideMaxYWithMargin = sideMaxY + ANNOTATION_MARGIN_TOP_BOTTOM;

  // ===== 计算需要的缩放比例 =====
  let scale = 1;

  // 检查top view的monitor是否超出安全区域
  const topExceedLeft = topMinXWithMargin < TOP_VIEW_SAFE_AREA.minX;
  const topExceedRight = topMaxXWithMargin > TOP_VIEW_SAFE_AREA.maxX;
  const topExceedTop = topMinYWithMargin < TOP_VIEW_SAFE_AREA.minY;
  const topExceedBottom = topMaxYWithMargin > TOP_VIEW_SAFE_AREA.maxY;

  if (topExceedLeft || topExceedRight || topExceedTop || topExceedBottom) {
    const topContentWidth = topMaxXWithMargin - topMinXWithMargin;
    const topContentHeight = topMaxYWithMargin - topMinYWithMargin;
    const safeWidth = TOP_VIEW_SAFE_AREA.maxX - TOP_VIEW_SAFE_AREA.minX - CANVAS_PADDING * 2;
    const safeHeight = TOP_VIEW_SAFE_AREA.maxY - TOP_VIEW_SAFE_AREA.minY - CANVAS_PADDING * 2;

    let scaleForWidth = 1;
    let scaleForHeight = 1;

    // 如果超出左边界或右边界，需要缩放宽度
    if (topExceedLeft || topExceedRight) {
      scaleForWidth = safeWidth / topContentWidth;
    }
    // 如果超出上边界或下边界，需要缩放高度
    if (topExceedTop || topExceedBottom) {
      scaleForHeight = safeHeight / topContentHeight;
    }

    scale = Math.min(scale, scaleForWidth, scaleForHeight);

    console.log('Top view needs scaling:', {
      contentSize: { width: topContentWidth, height: topContentHeight },
      safeSize: { width: safeWidth, height: safeHeight },
      bounds: { minX: topMinXWithMargin, maxX: topMaxXWithMargin, minY: topMinYWithMargin, maxY: topMaxYWithMargin },
      exceeds: { left: topExceedLeft, right: topExceedRight, top: topExceedTop, bottom: topExceedBottom },
      scaleForWidth,
      scaleForHeight,
      finalScale: scale
    });
  }

  // 检查side view的monitor是否超出安全区域
  const sideExceedLeft = sideMinXWithMargin < SIDE_VIEW_SAFE_AREA.minX;
  const sideExceedRight = sideMaxXWithMargin > SIDE_VIEW_SAFE_AREA.maxX;
  const sideExceedTop = sideMinYWithMargin < SIDE_VIEW_SAFE_AREA.minY;
  const sideExceedBottom = sideMaxYWithMargin > SIDE_VIEW_SAFE_AREA.maxY;

  if (sideExceedLeft || sideExceedRight || sideExceedTop || sideExceedBottom) {
    const sideContentWidth = sideMaxXWithMargin - sideMinXWithMargin;
    const sideContentHeight = sideMaxYWithMargin - sideMinYWithMargin;
    const safeWidth = SIDE_VIEW_SAFE_AREA.maxX - SIDE_VIEW_SAFE_AREA.minX - CANVAS_PADDING * 2;
    const safeHeight = SIDE_VIEW_SAFE_AREA.maxY - SIDE_VIEW_SAFE_AREA.minY - CANVAS_PADDING * 2;

    let scaleForWidth = 1;
    let scaleForHeight = 1;

    // 如果超出左边界或右边界，需要缩放宽度
    if (sideExceedLeft || sideExceedRight) {
      scaleForWidth = safeWidth / sideContentWidth;
    }
    // 如果超出上边界或下边界，需要缩放高度
    if (sideExceedTop || sideExceedBottom) {
      scaleForHeight = safeHeight / sideContentHeight;
    }

    scale = Math.min(scale, scaleForWidth, scaleForHeight);

    console.log('Side view needs scaling:', {
      contentSize: { width: sideContentWidth, height: sideContentHeight },
      safeSize: { width: safeWidth, height: safeHeight },
      bounds: { minX: sideMinXWithMargin, maxX: sideMaxXWithMargin, minY: sideMinYWithMargin, maxY: sideMaxYWithMargin },
      exceeds: { left: sideExceedLeft, right: sideExceedRight, top: sideExceedTop, bottom: sideExceedBottom },
      scaleForWidth,
      scaleForHeight,
      finalScale: scale
    });
  }

  // ===== 额外检查：确保缩放后monitor的X坐标不会是负数 =====
  // 这是最关键的检查，因为当距离很远时，monitor会超出左边界
  // 我们需要计算：缩放后的 headX - distanceToScreen * 缩放后的carScale 必须 >= 0
  // 即：originalHeadX - distanceToScreen * (scaledTopWidth / CAR_LENGTH) >= 0
  // 即：originalHeadX - distanceToScreen * (ORIGINAL_TOP_IMAGE_WIDTH * scale / CAR_LENGTH) >= 0
  // 即：scale <= originalHeadX * CAR_LENGTH / (distanceToScreen * ORIGINAL_TOP_IMAGE_WIDTH)

  const originalHeadX = ORIGINAL_TOP_IMAGE_WIDTH * HEAD_NORM_X;
  const maxScaleForPositiveX = (originalHeadX - ANNOTATION_MARGIN_LEFT_RIGHT) * CAR_LENGTH / (distanceToScreen * ORIGINAL_TOP_IMAGE_WIDTH);

  if (maxScaleForPositiveX < scale) {
    console.log('Scale limited by monitor X position:', {
      originalScale: scale,
      maxScaleForPositiveX,
      distanceToScreen,
      originalHeadX
    });
    scale = maxScaleForPositiveX;
  }

  console.log('Scale calculation:', {
    topBounds: {
      minX: topMinXWithMargin,
      maxX: topMaxXWithMargin,
      minY: topMinYWithMargin,
      maxY: topMaxYWithMargin
    },
    topExceeds: { topExceedLeft, topExceedRight, topExceedTop, topExceedBottom },
    sideBounds: {
      minX: sideMinXWithMargin,
      maxX: sideMaxXWithMargin,
      minY: sideMinYWithMargin,
      maxY: sideMaxYWithMargin
    },
    sideExceeds: { sideExceedLeft, sideExceedRight, sideExceedTop, sideExceedBottom },
    maxScaleForPositiveX,
    finalScale: scale
  });

  return scale;
}


const Home: NextPage = () => {
  const canvas = useRef<HTMLCanvasElement>(null)

  const { t } = useTranslation();

  // 非线性滑块转换函数：距离值 -> 滑块值
  const distanceToSliderValue = (distance: number): number => {
    if (distance <= SLIDER_RANGE1_DISTANCE_MAX) {
      return ((distance - SLIDER_RANGE1_DISTANCE_MIN) / (SLIDER_RANGE1_DISTANCE_MAX - SLIDER_RANGE1_DISTANCE_MIN)) *
        (SLIDER_RANGE1_SLIDER_MAX - SLIDER_RANGE1_SLIDER_MIN) + SLIDER_RANGE1_SLIDER_MIN;
    } else if (distance <= SLIDER_RANGE2_DISTANCE_MAX) {
      return ((distance - SLIDER_RANGE2_DISTANCE_MIN) / (SLIDER_RANGE2_DISTANCE_MAX - SLIDER_RANGE2_DISTANCE_MIN)) *
        (SLIDER_RANGE2_SLIDER_MAX - SLIDER_RANGE2_SLIDER_MIN) + SLIDER_RANGE2_SLIDER_MIN;
    } else if (distance <= SLIDER_RANGE3_DISTANCE_MAX) {
      return ((distance - SLIDER_RANGE3_DISTANCE_MIN) / (SLIDER_RANGE3_DISTANCE_MAX - SLIDER_RANGE3_DISTANCE_MIN)) *
        (SLIDER_RANGE3_SLIDER_MAX - SLIDER_RANGE3_SLIDER_MIN) + SLIDER_RANGE3_SLIDER_MIN;
    } else {
      return ((distance - SLIDER_RANGE4_DISTANCE_MIN) / (SLIDER_RANGE4_DISTANCE_MAX - SLIDER_RANGE4_DISTANCE_MIN)) *
        (SLIDER_RANGE4_SLIDER_MAX - SLIDER_RANGE4_SLIDER_MIN) + SLIDER_RANGE4_SLIDER_MIN;
    }
  };

  // 非线性滑块转换函数：滑块值 -> 距离值
  const sliderValueToDistance = (sliderValue: number): number => {
    if (sliderValue <= SLIDER_RANGE1_SLIDER_MAX) {
      return SLIDER_RANGE1_DISTANCE_MIN +
        (sliderValue - SLIDER_RANGE1_SLIDER_MIN) / (SLIDER_RANGE1_SLIDER_MAX - SLIDER_RANGE1_SLIDER_MIN) *
        (SLIDER_RANGE1_DISTANCE_MAX - SLIDER_RANGE1_DISTANCE_MIN);
    } else if (sliderValue <= SLIDER_RANGE2_SLIDER_MAX) {
      return SLIDER_RANGE2_DISTANCE_MIN +
        (sliderValue - SLIDER_RANGE2_SLIDER_MIN) / (SLIDER_RANGE2_SLIDER_MAX - SLIDER_RANGE2_SLIDER_MIN) *
        (SLIDER_RANGE2_DISTANCE_MAX - SLIDER_RANGE2_DISTANCE_MIN);
    } else if (sliderValue <= SLIDER_RANGE3_SLIDER_MAX) {
      return SLIDER_RANGE3_DISTANCE_MIN +
        (sliderValue - SLIDER_RANGE3_SLIDER_MIN) / (SLIDER_RANGE3_SLIDER_MAX - SLIDER_RANGE3_SLIDER_MIN) *
        (SLIDER_RANGE3_DISTANCE_MAX - SLIDER_RANGE3_DISTANCE_MIN);
    } else {
      return SLIDER_RANGE4_DISTANCE_MIN +
        (sliderValue - SLIDER_RANGE4_SLIDER_MIN) / (SLIDER_RANGE4_SLIDER_MAX - SLIDER_RANGE4_SLIDER_MIN) *
        (SLIDER_RANGE4_DISTANCE_MAX - SLIDER_RANGE4_DISTANCE_MIN);
    }
  };

  // 根据浏览器语言自动选择最合适的语言
  const detectBrowserLanguage = (): string => {
    const browserLang = navigator.language.toLowerCase();

    // 精确匹配
    if (browserLang === 'zh-cn' || browserLang === 'zh') return 'cn';
    if (browserLang === 'en' || browserLang.startsWith('en-')) return 'en';
    if (browserLang === 'it' || browserLang.startsWith('it-')) return 'it';
    if (browserLang === 'de' || browserLang.startsWith('de-')) return 'de';
    if (browserLang === 'es' || browserLang.startsWith('es-')) return 'es';
    if (browserLang === 'fr' || browserLang.startsWith('fr-')) return 'fr';
    if (browserLang === 'ja' || browserLang.startsWith('ja-')) return 'ja';

    // 默认返回英语
    return 'en';
  };

  const [language, setLanguage] = useStickyState(detectBrowserLanguage(), "language");

  const [distanceToScreen, setDistanceToScreen] = useStickyState(70, "distanceToScreen");
  const [screenSize, setScreenSize] = useStickyState(32, "screenSize");
  const [aspectRatioA, setAspectRatioA] = useStickyState(16, "aspectRatioA");
  const [aspectRatioB, setAspectRatioB] = useStickyState(9, "aspectRatioB");
  const [curvature, setCurvature] = useStickyState(0, "curvature")
  const [isTripleMonitor, setIsTripleMonitor] = useStickyState(true, "isTripleMonitor")
  const [tripleMonitorAngle, setTripleMonitorAngle] = useStickyState(60, "tripleMonitorAngle");
  const [showCustomAspectRatioInput, setShowCustomAspectRatioInput] = useState(false);
  const [showCustomCurvatureInput, setShowCustomCurvatureInput] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [gt7Mode, setGt7Mode] = useStickyState(false, "gt7Mode");

  const [gameFovs, setGameFovs] = useState<Record<string, string | number>>(() => {
    const initialFovs: Record<string, string | number> = {
      vFov: 0,
      hFov: 0,
    };

    // 初始化所有游戏的 FOV 值
    Object.keys(GameList).forEach(gameKey => {
      initialFovs[gameKey] = "";
    });

    return initialFovs;
  });

  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language]);

  useEffect(() => {
  }, [])

  // 当锁定 vFOV 时，自动调整 distanceToScreen
  // GT7 车内视角模式：自动调整 distanceToScreen 以达到固定垂直FOV
  useEffect(() => {
    if (!gt7Mode) return;

    const aspectRatio = aspectRatioA / aspectRatioB;
    const monitorInfo = getMonitor(screenSize, aspectRatio, curvature);

    // 使用二分查找来找到合适的距离
    let minDistance = MIN_DISTANCE_TO_SCREEN;
    let maxDistance = MAX_DISTANCE_TO_SCREEN;
    let bestDistance = distanceToScreen;
    let minDiff = Infinity;

    for (let i = 0; i < GT7_BINARY_SEARCH_ITERATIONS; i++) {
      const testDistance = (minDistance + maxDistance) / 2;
      const displayPos = calculateDisplayXYPos(testDistance, monitorInfo, tripleMonitorAngle);
      const verticalAngleNum = calcAngleNum(
        headPositions.x + xOffset,
        headPositions.sy,
        displayPos.sideMonX,
        displayPos.monSY,
        displayPos.sideMonX,
        displayPos.monSY + monitorInfo.h
      );

      const diff = Math.abs(verticalAngleNum - GT7_TARGET_VFOV);
      if (diff < minDiff) {
        minDiff = diff;
        bestDistance = testDistance;
      }

      if (verticalAngleNum > GT7_TARGET_VFOV) {
        minDistance = testDistance;
      } else {
        maxDistance = testDistance;
      }

      if (diff < GT7_FOV_TOLERANCE) break;
    }

    if (Math.abs(bestDistance - distanceToScreen) > GT7_DISTANCE_UPDATE_THRESHOLD) {
      setDistanceToScreen(Math.round(bestDistance));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gt7Mode, screenSize, aspectRatioA, aspectRatioB, curvature, tripleMonitorAngle])

  useEffect(() => {
    const drawCanvas = async () => {
      const ctx = canvas.current?.getContext("2d");
      if (!ctx) {
        return;
      }
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

      // 第一步:使用默认缩放(1.0)计算显示器位置和边界
      const aspectRatio = aspectRatioA / aspectRatioB;

      // 使用常量定义的原始图片尺寸和固定的归一化比例
      // 注意：不能使用全局变量，因为它们会在绘制过程中被修改
      const tempCarScale = ORIGINAL_TOP_IMAGE_WIDTH / CAR_LENGTH;
      const tempMonitorInfo = getMonitor(screenSize, aspectRatio, curvature, tempCarScale);

      // 使用固定的归一化比例计算临时head位置
      const tempHeadX = ORIGINAL_TOP_IMAGE_WIDTH * HEAD_NORM_X;
      const tempHeadTY = ORIGINAL_TOP_IMAGE_HEIGHT * HEAD_NORM_TOP_Y;
      const tempHeadSY = ORIGINAL_TOP_IMAGE_HEIGHT + 0 + ORIGINAL_SIDE_IMAGE_HEIGHT * HEAD_NORM_SIDE_Y;

      const tempTopMonX = tempHeadX - distanceToScreen * tempCarScale + tempMonitorInfo.thickness;
      const tempSideMonX = tempHeadX - distanceToScreen * tempCarScale;
      const tempMonTY = tempHeadTY - tempMonitorInfo.w / 2;
      const tempMonSY = tempHeadSY - tempMonitorInfo.h / 2;

      const tempDisplayPos = {
        headX: tempHeadX,
        headTY: tempHeadTY,
        headSY: tempHeadSY,
        topMonX: tempTopMonX,
        sideMonX: tempSideMonX,
        monTY: tempMonTY,
        monSY: tempMonSY,
        monLeftY: tempHeadTY + tempMonitorInfo.w / 2,
        monRightY: tempHeadTY - tempMonitorInfo.w / 2,
        tripleAngle: tripleMonitorAngle,
      };

      // 计算需要的统一缩放比例（只有超出安全区域时才缩放）
      const scale = calculateRequiredScale(
        tempDisplayPos,
        tempMonitorInfo,
        isTripleMonitor,
        tripleMonitorAngle,
        distanceToScreen
      );

      console.log('Calculated scale:', scale);

      // 第二步:使用计算出的缩放比例重新绘制
      await loadImage(ctx, scale)
      drawHeads(ctx)

      const monitorInfo = getMonitor(screenSize, aspectRatio, curvature)
      const displayPos = calculateDisplayXYPos(distanceToScreen, monitorInfo, tripleMonitorAngle);
      const verticalAngleNum = calcAngleNum(
        headPositions.x + xOffset,
        headPositions.sy,
        displayPos.sideMonX,
        displayPos.monSY,
        displayPos.sideMonX,
        displayPos.monSY + monitorInfo.h
      )
      const horizontalSingleAngleNum = calcAngleNum(
        headPositions.x + xOffset,
        headPositions.ty,
        displayPos.topMonX,
        displayPos.monTY,
        displayPos.topMonX,
        displayPos.monTY + monitorInfo.w
      )
      let horizontalTripleAngleNum = 0;
      let totalWidth = monitorInfo.w;
      if (isTripleMonitor) {
        const tripleSinX = monitorInfo.w * Math.sin(tripleMonitorAngle * DEGREES_TO_RADIANS)
        const tripleCosY = monitorInfo.w * Math.cos(tripleMonitorAngle * DEGREES_TO_RADIANS)
        horizontalTripleAngleNum = calcAngleNum(
          headPositions.x + xOffset,
          headPositions.ty,
          displayPos.topMonX + tripleSinX,
          displayPos.monTY - tripleCosY,
          displayPos.topMonX + tripleSinX,
          displayPos.monTY + monitorInfo.w + tripleCosY,
        )
        totalWidth = monitorInfo.w + 2 * monitorInfo.w * Math.cos(tripleMonitorAngle * DEGREES_TO_RADIANS)
      } else {
        horizontalTripleAngleNum = horizontalSingleAngleNum;
      }


      drawMonitors(
        ctx,
        curvature,
        isTripleMonitor,
        monitorInfo,
        displayPos,
        Math.round(verticalAngleNum),
        Math.round(horizontalSingleAngleNum),
        Math.round(horizontalTripleAngleNum),
        totalWidth,
        distanceToScreen,
      )

      drawSpecText(
        ctx,
        screenSize,
        isTripleMonitor,
        tripleMonitorAngle,
        aspectRatioA,
        aspectRatioB,
        curvature,
        headPositions.sy
      )

      drawWatermark(ctx)

      // 计算所有游戏的 FOV 值
      const newGameFovs: Record<string, string | number> = {
        vFov: Math.round(verticalAngleNum),
        hFov: Math.round(horizontalTripleAngleNum),
      };

      // 根据游戏类型计算对应的 FOV 值
      Object.entries(GameList).forEach(([gameKey, gameInfo]) => {
        let fovValue: string | number = "";

        switch (gameInfo.type) {
          case "cmf1-16-18":
            fovValue = (Math.min(Math.max((horizontalTripleAngleNum - CMF1_BASE_ANGLE) / 2 * CMF1_16_18_SCALE, CMF1_16_18_MIN), CMF1_16_18_MAX)).toFixed(gameInfo.digits);
            break;
          case "cmf1-19-20":
            fovValue = (Math.min(Math.max((horizontalTripleAngleNum - CMF1_BASE_ANGLE) / 2 * CMF1_19_20_SCALE, CMF1_19_20_MIN), CMF1_19_20_MAX)).toFixed(gameInfo.digits);
            break;
          case "cmf1-21":
            fovValue = (Math.min(Math.max((horizontalTripleAngleNum - CMF1_BASE_ANGLE) / 2 * CMF1_21_SCALE, CMF1_21_MIN), CMF1_21_MAX)).toFixed(gameInfo.digits);
            break;
          case "hfov-rad":
            fovValue = (verticalAngleNum * DEGREES_TO_RADIANS).toFixed(gameInfo.digits);
            break;
          case "hfov-deg":
            fovValue = horizontalTripleAngleNum.toFixed(gameInfo.digits);
            break;
          case "vfov-deg":
            fovValue = verticalAngleNum.toFixed(gameInfo.digits);
            break;
          case "vfov-degx2":
            fovValue = (verticalAngleNum * 2).toFixed(gameInfo.digits);
            break;
          case "vfov-gtr2":
            fovValue = Math.max(Math.min(GTR2_MAX, (verticalAngleNum / GTR2_VFOV_DIVISOR)), GTR2_MIN).toFixed(gameInfo.digits);
            break;
          case "vfov-race07":
            fovValue = Math.max(Math.min(RACE07_MAX, (verticalAngleNum / RACE07_VFOV_DIVISOR)), RACE07_MIN).toFixed(gameInfo.digits);
            break;
          case "vfov-dirtrally":
            fovValue = Math.ceil((Math.min(DIRT_RALLY_MAX_VFOV, Math.max(DIRT_RALLY_MIN_VFOV, verticalAngleNum)) - DIRT_RALLY_MIN_VFOV) / DIRT_RALLY_STEP);
            break;
        }

        newGameFovs[gameKey] = fovValue;
      });

      setGameFovs(newGameFovs);
    }

    drawCanvas();

  }, [
    distanceToScreen,
    screenSize,
    aspectRatioA,
    aspectRatioB,
    curvature,
    isTripleMonitor,
    tripleMonitorAngle,
  ])

  const handleExportCanvasAsImage = () => {
    const canvas = document.getElementById('fov-preview') as HTMLCanvasElement;
    const dataURL = canvas.toDataURL('image/jpeg');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = `fov-preview-${screenSize}${isTripleMonitor ? "x3" : ""}-${tripleMonitorAngle}.jpeg`;
    a.click();
  }

  // 过滤游戏列表
  const filteredGames = Object.entries(GameList).filter(([_, gameInfo]) => {
    if (!searchText) return true;
    const searchLower = searchText.toLowerCase();
    return (
      gameInfo.en.replace(/ /g, "").toLowerCase().includes(searchLower) ||
      gameInfo.cn.replace(/ /g, "").toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>FOV Calculator - Sim Racing Field of View Calculator for Single & Triple Monitor Setup</title>
        <meta name="description" content="Free FOV calculator for sim racing cockpits. Calculate optimal field of view for single monitor, triple monitor, curved & flat screens. Supports iRacing, Assetto Corsa, ACC, F1, and 50+ racing games." />
        <meta name="keywords" content="FOV calculator, field of view calculator, sim racing FOV, triple monitor FOV, curved monitor FOV, iRacing FOV, Assetto Corsa FOV, ACC FOV, racing simulator FOV, cockpit FOV, display FOV" />
        <meta name="author" content="nicholasxuu" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://fovcalc.xusf.xyz/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fovcalc.xusf.xyz/" />
        <meta property="og:title" content="FOV Calculator - Sim Racing Field of View Calculator" />
        <meta property="og:description" content="Free FOV calculator for sim racing cockpits. Calculate optimal field of view for single monitor, triple monitor, curved & flat screens. Supports 50+ racing games." />
        <meta property="og:image" content="https://fovcalc.xusf.xyz/assets/images/brz_top.jpg" />
        <meta property="og:locale" content={language === 'cn' ? 'zh_CN' : language === 'ja' ? 'ja_JP' : language === 'de' ? 'de_DE' : language === 'es' ? 'es_ES' : language === 'fr' ? 'fr_FR' : language === 'it' ? 'it_IT' : 'en_US'} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://fovcalc.xusf.xyz/" />
        <meta name="twitter:title" content="FOV Calculator - Sim Racing Field of View Calculator" />
        <meta name="twitter:description" content="Free FOV calculator for sim racing cockpits. Calculate optimal field of view for single monitor, triple monitor, curved & flat screens." />
        <meta name="twitter:image" content="https://fovcalc.xusf.xyz/assets/images/brz_top.jpg" />

        {/* Additional SEO tags */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="language" content={language === 'cn' ? 'Chinese' : language === 'ja' ? 'Japanese' : language === 'de' ? 'German' : language === 'es' ? 'Spanish' : language === 'fr' ? 'French' : language === 'it' ? 'Italian' : 'English'} />
        <meta httpEquiv="Content-Language" content={language === 'cn' ? 'zh-CN' : language === 'ja' ? 'ja' : language === 'de' ? 'de' : language === 'es' ? 'es' : language === 'fr' ? 'fr' : language === 'it' ? 'it' : 'en'} />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "FOV Calculator",
              "applicationCategory": "UtilityApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Free field of view calculator for sim racing cockpits. Supports single monitor, triple monitor, curved and flat screens. Calculate optimal FOV for iRacing, Assetto Corsa, ACC, F1, and 50+ racing games.",
              "url": "https://fovcalc.xusf.xyz/",
              "author": {
                "@type": "Person",
                "name": "nicholasxuu",
                "url": "https://github.com/nicholasxuu/"
              },
              "screenshot": "https://fovcalc.xusf.xyz/assets/images/brz_top.jpg",
              "featureList": [
                "Single Monitor FOV Calculation",
                "Triple Monitor FOV Calculation",
                "Curved Monitor Support",
                "Flat Monitor Support",
                "50+ Racing Games Support",
                "Visual FOV Preview",
                "Multiple Aspect Ratios",
                "Custom Screen Configurations",
                "Export Results as Image",
                "Multi-language Support (English, Chinese, Italian, German, Spanish, French, Japanese)"
              ],
              "keywords": "FOV calculator, field of view, sim racing, triple monitor, curved monitor, iRacing, Assetto Corsa, ACC, racing simulator"
            })
          }}
        />
      </Head>

      <GoogleAnalytics gaId="G-GN8YEE6FBQ" />

      <main className={styles.main}>
        <div className={styles.header}>
          <Selector
            options={
              [
                { value: "en", label: "English" },
                { value: "cn", label: "中文" },
                { value: "it", label: "Italiano" },
                { value: "de", label: "Deutsch" },
                { value: "es", label: "Español" },
                { value: "fr", label: "Français" },
                { value: "ja", label: "日本語" },
              ]
            }
            defaultValue={[language]}
            onChange={(e) => { setLanguage(e[0]) }}
          />

          <Button onClick={handleExportCanvasAsImage} color='primary' fill='outline' style={{ position: 'absolute', right: 10, top: 20 }}>{t("export_canvas")}</Button>
        </div>


        <div className={styles.body}>
          <div className={styles.display}>
            <canvas id="fov-preview" ref={canvas} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}></canvas>
            <div className={styles.gameFovData}>
              {t("horizontalFov")} {gameFovs.hFov}°<br />
              {t("verticalFov")} {gameFovs.vFov}°<br />
              <div style={{ marginTop: '0px', width: '100%', }}>
                <Input
                  placeholder={t("search_games")}
                  clearable
                  value={searchText}
                  onChange={setSearchText}
                  style={{ marginBottom: '0px', marginLeft: '0px', fontSize: '12px' }}
                />
                <div style={{
                  maxHeight: '100px',
                  overflowY: 'auto',
                  border: '1px solid #eee',
                  borderRadius: '4px',
                  padding: '0px'
                }}>
                  {filteredGames.map(([gameKey, gameInfo]) => (
                    <div key={gameKey} style={{
                      padding: '4px 0',
                      borderBottom: '1px solid #eee',
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}>
                      <span>{t(`game_${gameKey}`)}</span>
                      <span style={{ marginLeft: '8px' }}>{gameFovs[gameKey]}{gameInfo.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>


          <Form
            className={styles.mainform}
            name="basic"
            style={{ width: '360px' }}
          >
            <Form.Item>
              <Selector
                columns={2}
                options={
                  [
                    { value: "0", label: t("singleMonitor") },
                    { value: "1", label: t("tripleMonitor") },
                  ]
                }
                value={[isTripleMonitor ? "1" : "0"]}
                onChange={(e: ("" | "0" | "1")[]) => { setIsTripleMonitor(e[0] === "1") }}
              />
            </Form.Item>

            <Form.Item label={`${t("tripleMonitorAngle")}: ${tripleMonitorAngle}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Button
                  disabled={!isTripleMonitor || tripleMonitorAngle <= MIN_TRIPLE_MONITOR_ANGLE}
                  size="small"
                  fill="outline"
                  onClick={() => setTripleMonitorAngle(Math.max(MIN_TRIPLE_MONITOR_ANGLE, tripleMonitorAngle - 1))}
                >
                  -
                </Button>
                <div style={{ flex: 1 }}>
                  <Slider
                    disabled={!isTripleMonitor}
                    value={tripleMonitorAngle}
                    min={MIN_TRIPLE_MONITOR_ANGLE}
                    max={MAX_TRIPLE_MONITOR_ANGLE}
                    popover
                    onChange={(e) => setTripleMonitorAngle(e as number)}
                  />
                </div>
                <Button
                  disabled={!isTripleMonitor || tripleMonitorAngle >= MAX_TRIPLE_MONITOR_ANGLE}
                  size="small"
                  fill="outline"
                  onClick={() => setTripleMonitorAngle(Math.min(MAX_TRIPLE_MONITOR_ANGLE, tripleMonitorAngle + 1))}
                >
                  +
                </Button>
              </div>
            </Form.Item>

            <Form.Item label={`${t("distanceToScreen")}: ${distanceToScreen} ${t("cm")}${gt7Mode ? ` (${t("autoAdjusted")})` : ''}`}>
              {/* <Input type="number" value={`${distanceToScreen}`} onChange={(e) => setDistanceToScreen(parseInt(e))} /> */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Button
                  disabled={gt7Mode || distanceToScreen <= MIN_DISTANCE_TO_SCREEN}
                  size="small"
                  fill="outline"
                  onClick={() => setDistanceToScreen(Math.max(MIN_DISTANCE_TO_SCREEN, distanceToScreen - 1))}
                >
                  -
                </Button>
                <div style={{ flex: 1 }}>
                  <Slider
                    disabled={gt7Mode}
                    value={distanceToSliderValue(distanceToScreen)}
                    min={SLIDER_VALUE_MIN}
                    max={SLIDER_VALUE_MAX}
                    popover={(value) => `${Math.round(sliderValueToDistance(value))} cm`}
                    onChange={(e) => setDistanceToScreen(Math.round(sliderValueToDistance(e as number)))}
                  />
                </div>
                <Button
                  disabled={gt7Mode || distanceToScreen >= MAX_DISTANCE_TO_SCREEN}
                  size="small"
                  fill="outline"
                  onClick={() => setDistanceToScreen(Math.min(MAX_DISTANCE_TO_SCREEN, distanceToScreen + 1))}
                >
                  +
                </Button>
              </div>
            </Form.Item>
            <Form.Item label={`${t("screenSize")}: ${screenSize} ${t("inch")}`}>
              {/* <Input type="number" value={screenSize} onChange={setScreenSize} /> */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Button
                  disabled={screenSize <= MIN_SCREEN_SIZE}
                  size="small"
                  fill="outline"
                  onClick={() => setScreenSize(Math.max(MIN_SCREEN_SIZE, screenSize - 1))}
                >
                  -
                </Button>
                <div style={{ flex: 1 }}>
                  <Slider
                    value={screenSize}
                    min={MIN_SCREEN_SIZE}
                    max={MAX_SCREEN_SIZE}
                    popover
                    onChange={(e) => setScreenSize(e as number)}
                  />
                </div>
                <Button
                  disabled={screenSize >= MAX_SCREEN_SIZE}
                  size="small"
                  fill="outline"
                  onClick={() => setScreenSize(Math.min(MAX_SCREEN_SIZE, screenSize + 1))}
                >
                  +
                </Button>
              </div>
            </Form.Item>

            <div style={{ height: 88 }}>
              {showCustomAspectRatioInput ? (
                <Form.Item label={`${t("aspectRatio")}: ${aspectRatioA} : ${aspectRatioB}`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', justifyContent: 'flex-start' }}>
                      <Input type="number" value={aspectRatioA} onChange={setAspectRatioA} style={{ width: '70px', '--text-align': 'center' }} />
                      <span style={{ lineHeight: '23px' }}>:</span>
                      <Input type="number" value={aspectRatioB} onChange={setAspectRatioB} style={{ width: '70px', '--text-align': 'center' }} />
                    </div>
                    <Button
                      fill="outline"
                      color="primary"
                      onClick={() => setShowCustomAspectRatioInput(false)}
                    >
                      {t("back")}
                    </Button>
                  </div>
                </Form.Item>
              ) : (
                <Form.Item label={`${t("aspectRatio")}: ${aspectRatioA} : ${aspectRatioB}`}>
                  <Selector
                    columns={4}
                    options={[
                      { value: "16:9", label: "16:9" },
                      { value: "21:9", label: "21:9" },
                      { value: "32:9", label: "32:9" },
                      { value: "0:0", label: t("custom") },
                    ]}
                    value={[`${aspectRatioA}:${aspectRatioB}`]}
                    onChange={(e: `${number}:${number}`[]) => {
                      if (e[0] === "0:0") {
                        setShowCustomAspectRatioInput(true);
                        return;
                      }
                      const values = e[0].split(":");
                      setAspectRatioA(parseInt(values[0]));
                      setAspectRatioB(parseInt(values[1]));
                    }}
                  />
                </Form.Item>
              )}
            </div>

            <div style={{ height: '158px' }}>
              {showCustomCurvatureInput ? (
                <Form.Item label={`${t("curvature")}: ${curvature > 0 ? `${curvature}0R` : t("flat")}`}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Input
                        type="number"
                        value={curvature === 0 ? "0" : `${curvature * 10}`}
                        onChange={(val) => setCurvature(parseInt(val) / 10)}
                        style={{ width: '100px', '--text-align': 'center' }}
                      />
                      <span>R</span>
                    </div>
                    <Button
                      fill="outline"
                      color="primary"
                      onClick={() => setShowCustomCurvatureInput(false)}
                    >
                      {t("back")}
                    </Button>
                  </div>
                </Form.Item>
              ) : (
                <Form.Item label={`${t("curvature")}: ${curvature > 0 ? `${curvature}0R` : t("flat")}`}>
                  <Selector
                    columns={4}
                    options={[
                      { value: 80, label: "800R" },
                      { value: 100, label: "1000R" },
                      { value: 150, label: "1500R" },
                      { value: 180, label: "1800R" },
                      { value: 230, label: "2300R" },
                      { value: 380, label: "3800R" },
                      { value: 0, label: t("flat") },
                      { value: -1, label: t("custom") },
                    ]}
                    value={[curvature]}
                    onChange={(e: number[]) => {
                      if (e[0] === -1) {
                        setShowCustomCurvatureInput(true);
                        return;
                      }
                      setCurvature(e[0]);
                    }}
                  />
                </Form.Item>
              )}
            </div>

            <Form.Item label={t("specialMode")}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={gt7Mode}
                  onChange={(e) => setGt7Mode(e.target.checked)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <span>{t("gt7CockpitMode")}</span>
              </div>
            </Form.Item>

          </Form>

        </div >
      </main >

      <footer className={styles.footer}>
        By <a href="https://github.com/nicholasxuu/">sanfen</a>
      </footer>
    </div >
  )
}

// disable SSR
export default dynamic(() => Promise.resolve(Home), { ssr: false })
