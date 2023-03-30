/* eslint-disable */
/* generated */
export const JpMotd = () => {
  return (
    <>
      <h1>グラブル救援検索・マグナ</h1>
      <h2>グラブル救援検索・マグナ、4月1日からサービスを終了します。Twitter API の変更で、このサービスを続けるには大掛かりなエンジニアリングが必要になり、続けるのコストが高すぎだと思います。このアプリをご利用いただき、古戦場ことを祈います！</h2>
      <p>
        <strong>新機能</strong> Twitter APIの接続ができないバグを修正しました。 Lvl 275 Seofon Lv275 シエテ!
      </p>
      <p>
        <strong>ガイド</strong>
        <br />
        1️⃣ 検索追加
        <br />
        2️⃣ ➕を押すとバトル追加する
        <br />
        <strong>その他</strong>
        <br />
        🔔 \ 🔕 = 新しい救援が来たら通知する
        <br />
        📋 \ ❌ = 自動コピーする（携帯で動かない。）
      </p>
      <p>
        <strong>コメント・バグ報告・提案・何も</strong> 👉 DM vinlak#2106 @ discord
        <br />
        <strong>課金代を応援</strong> 👉 <a href="https://www.buymeacoffee.com/kalvin">ドネート</a>{' '}
      </p>
      <p>🚢 気に入ったら友達にご紹介してください!</p>
      <p>
        <strong>EN User</strong> 👉 You can switch language at (...)
        <br />
        <strong>中文用家</strong> 👉 你可以在（・・・）更改語言。
      </p>
      <p>
        <em>v2.6</em>
      </p>
    </>
  )
}

export const EnMotd = () => {
  return (
    <>
      <h1>GBFinder Omega</h1>
      <h2>This app will stop serving from the 1st April. The change made at Twitter API made service like this very diffcult to continue without huge engineering investment. Thank you for using this app and hope you best of luck in unite and fight.</h2>
      <p>
        <strong>New</strong> Fixed the bug that it cannot connect to the twitter API. Lvl 275 Seofon Lv275 シエテ!
      </p>
      <p>
        <strong>Guide</strong>
        <br />
        1️⃣ Add a search
        <br />
        2️⃣ Add raids by pressing the plus sign ➕<br />
        <strong>Functions</strong>
        <br />
        🔔 \ 🔕 = Toggle alert when new raid came
        <br />
        📋 \ ❌ = Toggle auto-copy (Not working in mobile phone)
      </p>
      <p>
        <strong>Bug/Suggestion/Idea/Anything</strong> 👉 DM vinlak#2106 @ discord
        <br />
        <strong>Consider gift me a gacha?</strong> 👉 <a href="https://www.buymeacoffee.com/kalvin">Donate</a>{' '}
      </p>
      <p>🚢 Please share this to your friend if you like it!</p>
      <p>
        <strong>日本語の方</strong> 👉 （・・・）で言語を設定できます。
        <br />
        <strong>中文用家</strong> 👉 你可以在（・・・）更改語言。
      </p>
      <p>
        <em>v2.6</em>
      </p>
    </>
  )
}

export const ZhMotd = () => {
  return (
    <>
      <h1>グラブル救援検索・マグナ</h1>
      <h2>本app會在四月一日停止服務。Twitter API 的更改使得本服務十分難以繼續。感謝你使用本app，祝你在古戦場中旗開得勝。</h2>

      <p>
        <strong>新功能</strong> 修復了無法連接Twitter API的問題。 Lvl 275 Seofon Lv275 シエテ!
      </p>
      <p>
        <strong>教學</strong>
        <br />
        1️⃣ 增加看板
        <br />
        2️⃣ 按加號➕ 增加副本
        <br />
        <strong>其他功能</strong>
        <br />
        🔔 \ 🔕 = 開啟新副本的提示鈴聲
        <br />
        📋 \ ❌ = 開啟自動複製(手機或背景執行時無法運作){' '}
      </p>
      <p>
        <strong>意見/問題/建議/吹水</strong> 👉 DM vinlak#2106 @ discord
        <br />
        <strong>支持我課金</strong> 👉 <a href="https://www.buymeacoffee.com/kalvin">一發入魂</a>{' '}
      </p>
      <p>🚢 如果你喜歡使用本網站，歡迎分享本網站給其他騎空士。</p>
      <p>
        <strong>日本語の方</strong> 👉 （・・・)で言語を設定できます。
        <br />
        <strong>EN User</strong> 👉 You can switch language at (...)
      </p>
      <p>
        <em>v2.6</em>
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
