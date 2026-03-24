import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
  Share,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ShoppingList } from '../types/shopping';

interface ShareListModalProps {
  visible: boolean;
  onClose: () => void;
  list: ShoppingList;
}

export default function ShareListModal({ visible, onClose, list }: ShareListModalProps) {
  const [shareMethod, setShareMethod] = useState<'email' | 'sms' | 'link' | 'whatsapp'>('link');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [customMessage, setCustomMessage] = useState(
    `Check out my shopping list "${list.name}"! 🛒\n\nItems: ${list.items.length}\nTotal: $${list.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}\n\n${list.description || ''}`
  );

  const handleShare = async () => {
    try {
      const listData = {
        name: list.name,
        description: list.description,
        items: list.items,
        total: list.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        store: list.store,
        createdAt: list.createdAt,
      };

      const shareContent = `🛒 Shopping List: ${list.name}\n\n${list.items.map(item => 
        `• ${item.quantity} ${item.unit} ${item.name} - $${(item.price * item.quantity).toFixed(2)}`
      ).join('\n')}\n\nTotal: $${list.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}\n\nStore: ${list.store}`;

      switch (shareMethod) {
        case 'email':
          if (!recipientEmail) {
            Alert.alert('Error', 'Please enter recipient email');
            return;
          }
          await Share.share({
            message: `To: ${recipientEmail}\n\n${customMessage}`,
            title: `Shopping List: ${list.name}`,
          });
          break;
          
        case 'sms':
          if (!recipientPhone) {
            Alert.alert('Error', 'Please enter recipient phone number');
            return;
          }
          await Share.share({
            message: `To: ${recipientPhone}\n\n${customMessage}`,
            title: `Shopping List: ${list.name}`,
          });
          break;
          
        case 'whatsapp':
          await Share.share({
            message: shareContent,
            title: `Shopping List: ${list.name}`,
          });
          break;
          
        case 'link':
          // Create shareable link (in real app, this would generate unique URL)
          const shareableLink = `https://groceryapp.app/list/${list.id}`;
          await Share.share({
            message: `Check out my shopping list: ${shareableLink}`,
            title: `Shopping List: ${list.name}`,
            url: shareableLink,
          });
          break;
      }
      
      Alert.alert('Success', 'Shopping list shared successfully!');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to share shopping list');
    }
  };

  const handleCopyLink = () => {
    const shareableLink = `https://groceryapp.app/list/${list.id}`;
    // In real app, this would copy to clipboard
    Alert.alert('Link Copied', 'Shareable link copied to clipboard!');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#333" />
          </Pressable>
          <Text style={styles.title}>Share Shopping List</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* List Preview */}
          <View style={styles.listPreview}>
            <Text style={styles.listName}>{list.name}</Text>
            {list.description && (
              <Text style={styles.listDescription}>{list.description}</Text>
            )}
            <Text style={styles.listStats}>
              {list.items.length} items • ${list.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
            </Text>
          </View>

          {/* Share Method Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Share Method</Text>
            <View style={styles.shareOptions}>
              <Pressable
                style={[
                  styles.shareOption,
                  shareMethod === 'link' && styles.shareOptionSelected,
                ]}
                onPress={() => setShareMethod('link')}
              >
                <Ionicons name="link-outline" size={20} color={shareMethod === 'link' ? '#4CAF50' : '#666'} />
                <Text style={styles.shareOptionText}>Share Link</Text>
              </Pressable>
              
              <Pressable
                style={[
                  styles.shareOption,
                  shareMethod === 'email' && styles.shareOptionSelected,
                ]}
                onPress={() => setShareMethod('email')}
              >
                <Ionicons name="mail-outline" size={20} color={shareMethod === 'email' ? '#4CAF50' : '#666'} />
                <Text style={styles.shareOptionText}>Email</Text>
              </Pressable>
              
              <Pressable
                style={[
                  styles.shareOption,
                  shareMethod === 'sms' && styles.shareOptionSelected,
                ]}
                onPress={() => setShareMethod('sms')}
              >
                <Ionicons name="chatbubble-outline" size={20} color={shareMethod === 'sms' ? '#4CAF50' : '#666'} />
                <Text style={styles.shareOptionText}>SMS</Text>
              </Pressable>
              
              <Pressable
                style={[
                  styles.shareOption,
                  shareMethod === 'whatsapp' && styles.shareOptionSelected,
                ]}
                onPress={() => setShareMethod('whatsapp')}
              >
                <Ionicons name="logo-whatsapp" size={20} color={shareMethod === 'whatsapp' ? '#4CAF50' : '#666'} />
                <Text style={styles.shareOptionText}>WhatsApp</Text>
              </Pressable>
            </View>
          </View>

          {/* Recipient Input */}
          {(shareMethod === 'email' || shareMethod === 'sms') && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Recipient {shareMethod === 'email' ? 'Email' : 'Phone Number'}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={shareMethod === 'email' ? 'Enter email address' : 'Enter phone number'}
                value={shareMethod === 'email' ? recipientEmail : recipientPhone}
                onChangeText={shareMethod === 'email' ? setRecipientEmail : setRecipientPhone}
                keyboardType={shareMethod === 'email' ? 'email-address' : 'phone-pad'}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          )}

          {/* Custom Message */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Message (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add a personal message..."
              value={customMessage}
              onChangeText={setCustomMessage}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActions}>
              <Pressable style={styles.quickAction} onPress={handleCopyLink}>
                <Ionicons name="copy-outline" size={18} color="#4CAF50" />
                <Text style={styles.quickActionText}>Copy Link</Text>
              </Pressable>
              <Pressable 
                style={styles.quickAction}
                onPress={() => Linking.openURL(`mailto:?subject=Shopping List: ${list.name}&body=${encodeURIComponent(customMessage)}`)}
              >
                <Ionicons name="mail-open-outline" size={18} color="#2196F3" />
                <Text style={styles.quickActionText}>Open Mail App</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        {/* Share Button */}
        <View style={styles.footer}>
          <Pressable style={styles.shareButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color="#fff" />
            <Text style={styles.shareButtonText}>Share List</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  closeButton: {
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  listPreview: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  listName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 5,
  },
  listDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  listStats: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 15,
  },
  shareOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  shareOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minWidth: 100,
  },
  shareOptionSelected: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
  },
  shareOptionText: {
    fontSize: 14,
    color: '#1A1A1A',
    marginLeft: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1A1A1A',
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  quickActions: {
    gap: 10,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  quickActionText: {
    fontSize: 14,
    color: '#1A1A1A',
    marginLeft: 8,
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  shareButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
