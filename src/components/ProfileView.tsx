import { useState } from 'react'
import {
  Pencil,
  CheckCircle2,
  MapPin,
  Phone,
  CreditCard,
  Mail,
} from 'lucide-react'
type ProfileTab = 'profile' | 'account' | 'address' | 'payment'
export function ProfileView() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('profile')
  return (
    <div className="h-full">
      {/* Tab Navigation */}
      <div className="px-10 pt-8">
        <div className="flex items-center gap-8 border-b border-cashmere">
          <button
            onClick={() => setActiveTab('profile')}
            className={`
              pb-3 text-sm font-medium transition-colors duration-300 relative
              ${activeTab === 'profile' ? 'text-bond-blue' : 'text-gilded hover:text-midnight'}
            `}
          >
            Profile
            {activeTab === 'profile' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-bond-blue rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`
              pb-3 text-sm font-medium transition-colors duration-300 relative
              ${activeTab === 'account' ? 'text-bond-blue' : 'text-gilded hover:text-midnight'}
            `}
          >
            Account Details
            {activeTab === 'account' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-bond-blue rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('address')}
            className={`
              pb-3 text-sm font-medium transition-colors duration-300 relative
              ${activeTab === 'address' ? 'text-bond-blue' : 'text-gilded hover:text-midnight'}
            `}
          >
            Address Book
            {activeTab === 'address' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-bond-blue rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`
              pb-3 text-sm font-medium transition-colors duration-300 relative
              ${activeTab === 'payment' ? 'text-bond-blue' : 'text-gilded hover:text-midnight'}
            `}
          >
            Payment Details
            {activeTab === 'payment' && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-bond-blue rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Profile Content */}
      {activeTab === 'profile' && (
        <div className="px-10 py-8">
          {/* Profile Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="w-[72px] h-[72px] rounded-full bg-bond-blue/60 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xl font-medium">AJ</span>
              </div>

              {/* Info */}
              <div>
                <h2 className="font-playfair text-2xl text-midnight leading-tight">
                  Alex Jordan
                </h2>
                <p className="text-gilded text-sm mt-0.5">
                  @alexjordan <span className="text-gilded/50">·</span> @ajesq
                </p>
                <p
                  className="text-gilded text-sm mt-0.5"
                  style={{
                    color: '#B3A28C',
                  }}
                >
                  Member since 2026
                </p>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button className="flex items-center gap-2 bg-bond-blue/50 text-white px-5 py-2.5 text-sm font-medium transition-all duration-300 hover:bg-bond-blue/60">
              <Pencil className="w-4 h-4" strokeWidth={1.6} />
              Edit Profile
            </button>
          </div>

          {/* Verification Badges */}
          <div className="flex items-center gap-6 mb-6">
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-bond-blue flex items-center justify-center flex-shrink-0">
                <CheckCircle2
                  className="w-3.5 h-3.5 text-white"
                  strokeWidth={2}
                />
              </span>
              <span
                className="text-xs font-medium uppercase text-gilded"
                style={{
                  letterSpacing: '0.1em',
                }}
              >
                Email Verified
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-bond-blue flex items-center justify-center flex-shrink-0">
                <CheckCircle2
                  className="w-3.5 h-3.5 text-white"
                  strokeWidth={2}
                />
              </span>
              <span
                className="text-xs font-medium uppercase text-gilded"
                style={{
                  letterSpacing: '0.1em',
                }}
              >
                Phone Verified
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-bond-blue flex items-center justify-center flex-shrink-0">
                <CheckCircle2
                  className="w-3.5 h-3.5 text-white"
                  strokeWidth={2}
                />
              </span>
              <span
                className="text-xs font-medium uppercase text-gilded"
                style={{
                  letterSpacing: '0.1em',
                }}
              >
                KYC Verified
              </span>
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-cashmere my-6" />

          {/* Info Grid — Row 1 */}
          <div className="grid grid-cols-2 gap-x-16 gap-y-0">
            {/* Default Address */}
            <div className="flex items-start gap-3 py-6">
              <MapPin
                className="w-5 h-5 text-gilded flex-shrink-0 mt-0.5"
                strokeWidth={1.4}
              />
              <div>
                <p
                  className="text-gilded text-[10px] font-medium uppercase mb-1.5"
                  style={{
                    letterSpacing: '0.14em',
                  }}
                >
                  Default Address
                </p>
                <p className="text-midnight text-sm font-medium">
                  123 Main Street
                </p>
                <p className="text-midnight/70 text-sm">Madison, WI 53703</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3 py-6">
              <Phone
                className="w-5 h-5 text-gilded flex-shrink-0 mt-0.5"
                strokeWidth={1.4}
              />
              <div>
                <p
                  className="text-gilded text-[10px] font-medium uppercase mb-1.5"
                  style={{
                    letterSpacing: '0.14em',
                  }}
                >
                  Phone
                </p>
                <p className="text-midnight text-sm font-medium">
                  +1 (608) 555-0142
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-cashmere" />

          {/* Info Grid — Row 2 */}
          <div className="grid grid-cols-2 gap-x-16 gap-y-0">
            {/* Default Payment */}
            <div className="flex items-start gap-3 py-6">
              <CreditCard
                className="w-5 h-5 text-gilded flex-shrink-0 mt-0.5"
                strokeWidth={1.4}
              />
              <div>
                <p
                  className="text-gilded text-[10px] font-medium uppercase mb-1.5"
                  style={{
                    letterSpacing: '0.14em',
                  }}
                >
                  Default Payment
                </p>
                <p className="text-midnight text-sm font-medium">
                  Visa ending in 4242
                </p>
                <p className="text-midnight/70 text-sm">Expires 12/2025</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3 py-6">
              <Mail
                className="w-5 h-5 text-gilded flex-shrink-0 mt-0.5"
                strokeWidth={1.4}
              />
              <div>
                <p
                  className="text-gilded text-[10px] font-medium uppercase mb-1.5"
                  style={{
                    letterSpacing: '0.14em',
                  }}
                >
                  Email
                </p>
                <p className="text-midnight text-sm font-medium">
                  alex@email.com
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Placeholder for other tabs */}
      {activeTab !== 'profile' && (
        <div className="flex items-center justify-center py-20">
          <p className="font-playfair italic text-xl text-midnight/30">
            {activeTab === 'account' && 'Account Details'}
            {activeTab === 'address' && 'Address Book'}
            {activeTab === 'payment' && 'Payment Details'}
          </p>
        </div>
      )}
    </div>
  )
}
