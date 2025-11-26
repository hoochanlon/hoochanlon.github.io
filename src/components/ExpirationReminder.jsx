// src/components/ExpirationReminder.jsx
import React from "react";

const ExpirationReminder = ({ pubDatetime }) => {
  const currentDate = new Date();  // 获取当前日期
  const publicationDate = new Date(pubDatetime);  // 将 pubDatetime 转换为 Date 对象
  const timeDiff = currentDate - publicationDate;  // 计算时间差
  const oneYear = 365 * 24 * 60 * 60 * 1000;  // 一年的毫秒数

  // 如果文章发布时间在一年之前，认为文章已经过期
  const isExpired = timeDiff > oneYear;

  if (!isExpired) return null; // 如果文章没有过期，不显示提醒

  return (
    <div style={{ backgroundColor: "#ffcc00", padding: "10px", borderRadius: "5px", margin: "20px 0", textAlign: "center" }}>
      <strong>⚠️ 这篇文章已过期，内容可能不再准确。</strong>
    </div>
  );
};

export default ExpirationReminder;
