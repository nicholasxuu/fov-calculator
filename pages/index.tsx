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


const MONITOR_COLOR = '#f00';
const MONITOR_THICKNESS = 5;
const HEAD_SIZE = 6;
const CAR_LENGTH = 424; // centimetres, used to calculate scale for monitors
const BACKGROUND_COLOR = '#ffffff';
const TEXT_COLOR = '#666666';
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 560;
const xOffset = 0;


let headPositions = {
  normX: 0.555, // normalized value, 0-1
  normTY: 0.67,
  normSY: 0.22,
  x: 0,
  ty: 0,
  sy: 0,
};
let carScale = 1;

const getImage = (src: string) => new Promise<HTMLImageElement>((resolve) => {
  const topImage = new Image()
  topImage.src = src;
  topImage.onload = () => {
    resolve(topImage)
  }
})

const loadImage = async (ctx: CanvasRenderingContext2D) => {
  console.log('load images')


  const currPath = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/${window.location.pathname}`;
  const topImage = await getImage(`${currPath}/assets/images/brz_top.jpg`)
  const sideImage = await getImage(`${currPath}/assets/images/brz_side.jpg`)
  // fill canvas with white background
  ctx.globalAlpha = 1;
  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.globalAlpha = 0.5;

  ctx.drawImage(topImage, 0, 0);
  ctx.drawImage(sideImage, 0, topImage.height + 80);

  console.log(topImage.height, topImage.width)
  headPositions.x = topImage.width * headPositions.normX;
  headPositions.ty = topImage.height * headPositions.normTY;
  headPositions.sy = sideImage.height * headPositions.normSY + topImage.height + 80;
  carScale = topImage.width / CAR_LENGTH
  console.log('load images complete')

}

const drawHeads = (ctx: CanvasRenderingContext2D) => {
  console.log("draw heads");
  ctx.globalAlpha = 1;
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
  ctx.globalAlpha = 0.7;
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
  ctx.globalAlpha = 0.7;
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
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = MONITOR_COLOR;

  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(topMonX, headSY);
  ctx.lineTo(headX - 32, headSY);
  ctx.moveTo(headX - 5, headSY);
  ctx.lineTo(headX, headSY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.globalAlpha = 1;
  const textSize = 10;
  ctx.fillText(`${distanceToScreen} cm`, topMonX + 5, headSY - textSize / 2)
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
) => {
  ctx.globalAlpha = 1;
  ctx.strokeStyle = MONITOR_COLOR;

  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(fromX, fromY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  if (fromX === toX) {
    ctx.globalAlpha = 1;
    const textSize = 10;
    ctx.fillText(`${angleNum}\u00b0`, centerX + textOffsetX, centerY + textOffsetY + textSize / 2)
  }
}

const drawLengthCalibration = (
  ctx: CanvasRenderingContext2D,
  totalWidth: number,

  centerY: number,
  toX: number,
) => {
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = MONITOR_COLOR;

  ctx.lineWidth = 1;

  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(toX, centerY - totalWidth / 2);
  ctx.lineTo(toX, centerY + totalWidth / 2);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.beginPath();
  ctx.moveTo(toX - 20, centerY - totalWidth / 2);
  ctx.lineTo(toX + 20, centerY - totalWidth / 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(toX - 20, centerY + totalWidth / 2);
  ctx.lineTo(toX + 20, centerY + totalWidth / 2);
  ctx.stroke();

  ctx.globalAlpha = 1;
  const textSize = 10;
  ctx.fillText(`${(totalWidth / carScale + 2).toFixed(1)} cm`, toX, centerY - totalWidth / 2 - textSize / 2)
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
  ctx.globalAlpha = 1;
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = "15px Arial";
  ctx.fillText(`${screenSize}${t("inch")} ${isTripleMonitor ? `${t("tripleMonitor")} ${tripleMonitorAngle}\u00B0 ${t("angle")}` : ""}`, 10, headSY - 30);
  ctx.fillText(`${aspectRatioA}:${aspectRatioB} ${curvature > 0 ? `${curvature}0R` : t("flat")}`, 10, headSY - 10);
}

const drawWatermark = (ctx: CanvasRenderingContext2D) => {
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = "15px Arial";
  const watermark = "fovcalc.xusf.xyz"
  ctx.fillText(watermark, 370, 15);
  ctx.fillText(watermark, 170, CANVAS_HEIGHT - 10);
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
  ctx.globalAlpha = 0.5;
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
  drawAngle(ctx, headX, headSY, sideMonX, monSY, sideMonX, monSY + monitorInfo.h, -30, 0, verticalAngleNum);
  drawDistanceLine(ctx, topMonX, headX, headSY, distanceToScreen);

  drawLengthCalibration(ctx, monitorInfo.h, headSY, sideMonX - 12);

  // top view, center monitor
  ctx.lineWidth = MONITOR_THICKNESS;
  if (curveRadius <= 0) {
    drawLine(ctx, topMonX, monTY, monTY + monitorInfo.w);
  } else {
    drawVerticalArc(ctx, topMonX, monTY, monTY + monitorInfo.w, curveRadius * carScale);
  }
  drawAngle(ctx, headX, headTY, topMonX, monTY, topMonX, monTY + monitorInfo.w, -30, 0, horizontalSingleAngleNum);

  let topViewSidePointX = topMonX - 12;

  if (isTripleMonitor) {
    // top view, left monitor
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(topMonX + MONITOR_THICKNESS / 2, monLeftY);
    ctx.rotate((-tripleAngle * Math.PI) / 180);
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
    ctx.rotate(((tripleAngle) * Math.PI) / 180);
    ctx.translate(-topMonX - MONITOR_THICKNESS / 2, -monRightY);
    ctx.lineWidth = MONITOR_THICKNESS;

    if (curveRadius <= 0) {
      drawLine(ctx, topMonX, monRightY - monitorInfo.w, monRightY);
    } else {
      drawVerticalArc(ctx, topMonX, monRightY - monitorInfo.w, monRightY, curveRadius * carScale);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const sinX = monitorInfo.w * Math.sin(tripleAngle * Math.PI / 180)
    const cosY = monitorInfo.w * Math.cos(tripleAngle * Math.PI / 180)
    drawAngle(ctx, headX, headTY, topMonX + sinX, monTY - cosY, topMonX + sinX, monTY + monitorInfo.w + cosY, 10, 0, horizontalTripleAngleNum);

    topViewSidePointX = topMonX + sinX;
  }

  drawLengthCalibration(ctx, totalWidth, headTY, topViewSidePointX);


}

const getMonitor = (screenSize: number, aspectRatio: number, curveRadius: number): any => {
  const realWidth = (2.54 * screenSize) * (aspectRatio / Math.sqrt(1 + aspectRatio * aspectRatio))
  const realHeight = realWidth / aspectRatio
  const width = carScale * realWidth
  const height = carScale * realHeight

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
    const angle = realWidth / (curveRadius * 2 * Math.PI) * 360 / 180 * Math.PI
    console.log("angle", angle)
    const boxDepth = curveRadius - curveRadius * Math.cos(angle / 2)
    const boxWidth = curveRadius * Math.sin(angle / 2) * 2
    mon.thickness = boxDepth * carScale
    mon.w = boxWidth * carScale
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
  const angleNum = angle / Math.PI * 180 * 2;

  if (centerX < fromX) {
    return 360 - angleNum;
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


const Home: NextPage = () => {
  const canvas = useRef<HTMLCanvasElement>(null)

  const { t } = useTranslation();

  // 非线性滑块转换函数
  // 实际值范围: 10-400
  // 滑块值范围: 0-100
  // 10-50 占据滑块的 0-10 (10%)
  // 50-100 占据滑块的 10-70 (60%)
  // 100-200 占据滑块的 70-90 (20%)
  // 200-400 占据滑块的 90-100 (10%)
  const distanceToSliderValue = (distance: number): number => {
    if (distance <= 50) {
      // 10-50 映射到 0-10
      return ((distance - 10) / (50 - 10)) * 10;
    } else if (distance <= 100) {
      // 50-100 映射到 10-70
      return 10 + ((distance - 50) / (100 - 50)) * 60;
    } else if (distance <= 200) {
      // 100-200 映射到 70-90
      return 70 + ((distance - 100) / (200 - 100)) * 20;
    } else {
      // 200-400 映射到 90-100
      return 90 + ((distance - 200) / (400 - 200)) * 10;
    }
  };

  const sliderValueToDistance = (sliderValue: number): number => {
    if (sliderValue <= 10) {
      // 0-10 映射到 10-50
      return 10 + (sliderValue / 10) * (50 - 10);
    } else if (sliderValue <= 70) {
      // 10-70 映射到 50-100
      return 50 + ((sliderValue - 10) / 60) * (100 - 50);
    } else if (sliderValue <= 90) {
      // 70-90 映射到 100-200
      return 100 + ((sliderValue - 70) / 20) * (200 - 100);
    } else {
      // 90-100 映射到 200-400
      return 200 + ((sliderValue - 90) / 10) * (400 - 200);
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
  // GT7 车内视角模式：自动调整 distanceToScreen 以达到 55° vFOV
  useEffect(() => {
    if (!gt7Mode) return;

    const targetVFov = 55; // GT7 车内视角固定为 55°
    const aspectRatio = aspectRatioA / aspectRatioB;
    const monitorInfo = getMonitor(screenSize, aspectRatio, curvature);

    // 使用二分查找来找到合适的距离
    let minDistance = 10;
    let maxDistance = 400;
    let bestDistance = distanceToScreen;
    let minDiff = Infinity;

    for (let i = 0; i < 50; i++) {
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

      const diff = Math.abs(verticalAngleNum - targetVFov);
      if (diff < minDiff) {
        minDiff = diff;
        bestDistance = testDistance;
      }

      if (verticalAngleNum > targetVFov) {
        minDistance = testDistance;
      } else {
        maxDistance = testDistance;
      }

      if (diff < 0.1) break;
    }

    if (Math.abs(bestDistance - distanceToScreen) > 0.5) {
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


      await loadImage(ctx)
      drawHeads(ctx)


      const aspectRatio = aspectRatioA / aspectRatioB;
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
        const tripleSinX = monitorInfo.w * Math.sin(tripleMonitorAngle * Math.PI / 180)
        const tripleCosY = monitorInfo.w * Math.cos(tripleMonitorAngle * Math.PI / 180)
        horizontalTripleAngleNum = calcAngleNum(
          headPositions.x + xOffset,
          headPositions.ty,
          displayPos.topMonX + tripleSinX,
          displayPos.monTY - tripleCosY,
          displayPos.topMonX + tripleSinX,
          displayPos.monTY + monitorInfo.w + tripleCosY,
        )
        totalWidth = monitorInfo.w + 2 * monitorInfo.w * Math.cos(tripleMonitorAngle * Math.PI / 180)
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
            fovValue = (Math.min(Math.max((horizontalTripleAngleNum - 77) / 2 * 0.05, -1), 1)).toFixed(gameInfo.digits);
            break;
          case "cmf1-19-20":
            fovValue = (Math.min(Math.max((horizontalTripleAngleNum - 77) / 2 * 0.1, -10), 10)).toFixed(gameInfo.digits);
            break;
          case "cmf1-21":
            fovValue = (Math.min(Math.max((horizontalTripleAngleNum - 77) / 2 * 1, -20), 20)).toFixed(gameInfo.digits);
            break;
          case "hfov-rad":
            fovValue = (verticalAngleNum / 180 * Math.PI).toFixed(gameInfo.digits);
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
            fovValue = Math.max(Math.min(1.5, (verticalAngleNum / 58)), 0.5).toFixed(gameInfo.digits);
            break;
          case "vfov-race07":
            fovValue = Math.max(Math.min(1.5, (verticalAngleNum / 58)), 0.4).toFixed(gameInfo.digits);
            break;
          case "vfov-dirtrally":
            fovValue = Math.ceil((Math.min(70, Math.max(30, verticalAngleNum)) - 30) / 5);
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
                  disabled={!isTripleMonitor || tripleMonitorAngle <= 0}
                  size="small"
                  fill="outline"
                  onClick={() => setTripleMonitorAngle(Math.max(0, tripleMonitorAngle - 1))}
                >
                  -
                </Button>
                <div style={{ flex: 1 }}>
                  <Slider
                    disabled={!isTripleMonitor}
                    value={tripleMonitorAngle}
                    min={0}
                    max={90}
                    popover
                    onChange={(e) => setTripleMonitorAngle(e as number)}
                  />
                </div>
                <Button
                  disabled={!isTripleMonitor || tripleMonitorAngle >= 90}
                  size="small"
                  fill="outline"
                  onClick={() => setTripleMonitorAngle(Math.min(90, tripleMonitorAngle + 1))}
                >
                  +
                </Button>
              </div>
            </Form.Item>

            <Form.Item label={`${t("distanceToScreen")}: ${distanceToScreen} ${t("cm")}${gt7Mode ? ` (${t("autoAdjusted")})` : ''}`}>
              {/* <Input type="number" value={`${distanceToScreen}`} onChange={(e) => setDistanceToScreen(parseInt(e))} /> */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Button
                  disabled={gt7Mode || distanceToScreen <= 10}
                  size="small"
                  fill="outline"
                  onClick={() => setDistanceToScreen(Math.max(10, distanceToScreen - 1))}
                >
                  -
                </Button>
                <div style={{ flex: 1 }}>
                  <Slider
                    disabled={gt7Mode}
                    value={distanceToSliderValue(distanceToScreen)}
                    min={0}
                    max={100}
                    popover={(value) => `${Math.round(sliderValueToDistance(value))} cm`}
                    onChange={(e) => setDistanceToScreen(Math.round(sliderValueToDistance(e as number)))}
                  />
                </div>
                <Button
                  disabled={gt7Mode || distanceToScreen >= 400}
                  size="small"
                  fill="outline"
                  onClick={() => setDistanceToScreen(Math.min(400, distanceToScreen + 1))}
                >
                  +
                </Button>
              </div>
            </Form.Item>
            <Form.Item label={`${t("screenSize")}: ${screenSize} ${t("inch")}`}>
              {/* <Input type="number" value={screenSize} onChange={setScreenSize} /> */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Button
                  disabled={screenSize <= 5}
                  size="small"
                  fill="outline"
                  onClick={() => setScreenSize(Math.max(5, screenSize - 1))}
                >
                  -
                </Button>
                <div style={{ flex: 1 }}>
                  <Slider
                    value={screenSize}
                    min={5}
                    max={110}
                    popover
                    onChange={(e) => setScreenSize(e as number)}
                  />
                </div>
                <Button
                  disabled={screenSize >= 110}
                  size="small"
                  fill="outline"
                  onClick={() => setScreenSize(Math.min(110, screenSize + 1))}
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
