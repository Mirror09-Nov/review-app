import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

// Twilio設定
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN  
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, verificationCode } = await request.json()

    // 開発環境では実際のSMS送信をスキップ
    if (process.env.NODE_ENV === 'development' || !accountSid || !authToken) {
      console.log('📱 開発モード: SMS送信をスキップ')
      console.log(`認証コード: ${verificationCode}`)
      console.log(`送信先: ${phoneNumber}`)
      
      return NextResponse.json({ 
        success: true, 
        message: '開発モード: 認証コードをコンソールで確認してください',
        code: verificationCode // 開発環境でのみ返す
      })
    }

    // 本番環境: 実際のSMS送信
    const client = twilio(accountSid, authToken)
    
    const message = await client.messages.create({
      body: `店舗管理者認証コード: ${verificationCode}\n\n※このコードは10分間有効です。`,
      from: twilioPhoneNumber,
      to: phoneNumber
    })

    console.log('✅ SMS送信成功:', message.sid)
    
    return NextResponse.json({ 
      success: true, 
      message: 'SMS認証コードを送信しました',
      messageSid: message.sid
    })

  } catch (error) {
    console.error('❌ SMS送信エラー:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'SMS送信に失敗しました' 
      },
      { status: 500 }
    )
  }
}