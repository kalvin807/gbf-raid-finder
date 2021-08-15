/* eslint-disable */
/* generated */
import React from 'react'

export const JpMotd = () => {
  return (
    <>
      <h2 id="-">グラブル救援検索・マグナへようこそ</h2>
      <p>
        <strong>追加</strong> HL5★ アニマ・アニムス・コア。
      </p>
      <p>
        <strong>ガイド</strong>
        <br />
        バトル追加 = 救援を追加する
        <br />
        🔔 \ 🔕 = 新しい救援が来たら通知する
        <br />
        📋 \ ❌ = 自動コピーする（携帯で動かない。）
      </p>
      <p>
        <strong>新デザインのご意見</strong> 👉 <a href="https://strawpoll.com/1h5qde2j1">投票する</a>
        <br />
        <strong>不具合報告・ご意見</strong> 👉{' '}
        <a href="https://github.com/kalvin807/gbf-raid-finder/issues">GitHubでIssueを作成する</a>
        <br />
        <strong>課金代を応援</strong> 👉 <a href="https://www.buymeacoffee.com/kalvin">ドネート</a>{' '}
      </p>
      <p>🚢 気に入ったら友達にご紹介してください!</p>
      <p>
        <strong>EN User</strong> 👉 You can switch language at (...)
        <br />
        <strong>中文用家</strong> 👉 你可以在（・・・）更改語言。
      </p>
    </>
  )
}

export const EnMotd = () => {
  return (
    <>
      <h2 id="welcome-to-gbf-raid-finder-omega">Welcome to GBF Raid Finder Omega</h2>
      <p>
        <strong>Update</strong> Impossible 5★ Anima-Animus Core.
      </p>
      <p>
        <strong>Guide</strong>
        <br />
        Add raid = Select a raid to follow
        <br />
        🔔 \ 🔕 = Toggle alert when new raid came
        <br />
        📋 \ ❌ = Toggle auto-copy (Not working in mobile phone)
      </p>
      <p>
        <strong>New UI</strong> Vote your preference 👉 <a href="https://strawpoll.com/1h5qde2j1">Vote</a>
        <br />
        <strong>Bug/Suggestion/Idea</strong> 👉{' '}
        <a href="https://github.com/kalvin807/gbf-raid-finder/issues">Create an issue at GitHub</a>
        <br />
        <strong>Consider gift me a gacha?</strong> 👉 <a href="https://www.buymeacoffee.com/kalvin">Donate</a>{' '}
      </p>
      <p>🚢 Please share this to your friend if you like it!</p>
      <p>
        <strong>日本語の方</strong> 👉 （・・・）で言語を設定できます。
        <br />
        <strong>中文用家</strong> 👉 你可以在（・・・）更改語言。
      </p>
    </>
  )
}

export const ZhMotd = () => {
  return (
    <>
      <h2 id="-">歡迎來到グラブル救援検索・マグナ</h2>
      <p>
        <strong>新功能</strong> HL5★ アニマ・アニムス・コア。
      </p>
      <p>
        <strong>懶人包</strong>
        <br />
        增加副本 = 增加你想追蹤的副本
        <br />
        🔔 \ 🔕 = 開啟新副本的提示鈴聲
        <br />
        📋 \ ❌ = 開啟自動複製(手機或背景執行時無法運作){' '}
      </p>
      <p>
        <strong>新UI</strong> 正收集大家對新UI之意見 👉 <a href="https://strawpoll.com/1h5qde2j1">投票</a>
        <br />
        <strong>問題/提議</strong> 👉{' '}
        <a href="https://github.com/kalvin807/gbf-raid-finder/issues">請到GitHub開新Issue</a>
        <br />
        <strong>支持我課金</strong> 👉 <a href="https://www.buymeacoffee.com/kalvin">一發入魂</a>{' '}
      </p>
      <p>🚢 如果你喜歡使用本網站，歡迎分享本網站給其他騎空士。</p>
      <p>
        <strong>日本語の方</strong> 👉 （・・・)で言語を設定できます。
        <br />
        <strong>EN User</strong> 👉 You can switch language at (...)
      </p>
    </>
  )
}

export const Motd = ({ lang }: { lang: 'zh' | 'ja' | 'en' }) => {
  switch (lang) {
    case 'zh':
      return ZhMotd()
    case 'ja':
      return JpMotd()
    case 'en':
    default:
      return EnMotd()
  }
}
