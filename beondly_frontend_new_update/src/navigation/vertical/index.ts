// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'ホーム',
      path: '/home',
      icon: 'mdi:home-account'
    },

    // {
    //   title: 'プロンプト編集',
    //   path: '/edit-prompt',
    //   icon: 'material-symbols:edit-document-rounded'
    // },
    {
      path: '/acl',
      action: 'read',
      subject: 'acl-page',
      title: 'マイプロジェクト',
      icon: 'material-symbols:home-repair-service-rounded'
    },
    {
      path: '/acl/edit',
      action: 'read',
      subject: 'acl-page',
      title: 'インテリアの作成',
      icon: 'material-symbols:chair'
    },
    {
      path: '/acl/help',
      action: 'read',
      subject: 'acl-page',
      title: 'このサービスについて',
      icon: 'mdi:help-circle'
    }
  ]
}

export default navigation
